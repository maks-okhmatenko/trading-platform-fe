import _sortBy from 'lodash/sortBy';
import _throttle from 'lodash/throttle';
import moment from 'moment';
import socketIOClient from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { all, call, fork, put, take } from 'redux-saga/effects';

import { initWebSocket } from '../api/socket';
import * as AppActions from '../containers/App/actions';
import { ActionTypes, WS_IO_URL, EVENT_NAME } from '../containers/App/constants';

function transformTickers(data) {
  return data.reduce((acc, curr) => {
    const { Symbol, ...rest } = curr;

    return { ...acc, [Symbol]: rest };
  }, {});
}

function initSocketSaga() {
  return eventChannel(emitter => {
    const socketParams = {
      onOpen: () => emitter(AppActions.socketConnect()),
      onError: (error) => emitter(AppActions.socketError(error)),
      onMessage: _throttle((data) => {
        const sorted = _sortBy(data, 'Bid').reverse();
        const tickers = transformTickers(sorted);
        return emitter(AppActions.socketMessage(tickers));
      }, 1000),
    };

    initWebSocket(socketParams);

    return () => {
      // do whatever to interrupt the socket communication here
    };
  });
}

function* watchSocket() {
  const channel = yield call(initSocketSaga);

  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

// ================================================

export const socketConnect = (url: string, params?: {}) => {
  return socketIOClient(url, params);
};

function createSocketChannel(socket) {
  return eventChannel(emit => {
    const errorHandler = (error) => {
      emit(AppActions.socketError(error));
    };

    socket.on('connect', () => {
      console.log('Socket IO connected');
      emit(AppActions.socketIoConnect());
    });

    socket.on('online', (data) => {
    });

    socket.once('onGlobalConfig', (config) => {
      emit(AppActions.socketIoGlobalConfig(config));

      emit(AppActions.socketIoSubscribeTimeframe(EVENT_NAME.SUBSCRIBE_TIME_FRAME, {
        symbol: config.TICKER_LIST[0],
        frameType: config.CONSTANTS.FRAME_TYPES.M1,
        // from: moment().subtract(20, 'minute').unix(),
        from: moment().subtract(8, 'h').unix(),
        to: moment().unix(),
      }));

      emit(AppActions.changeActiveSymbolChart(config.TICKER_LIST[0]));
    });

    socket.on('initialTimeframes', (initialData) => {
      emit(AppActions.socketIoInitialTimeframe(initialData));
    });

    socket.on('appendTimeframe', (dataItem) => {
      emit(AppActions.socketIoAppendTimeframe(dataItem));
    });

    socket.on('tickers', (tickers) => {
      const sorted = _sortBy(tickers, 'Bid').reverse();
      const tickersSorted = transformTickers(sorted);
      emit(AppActions.socketIoTickers(tickersSorted));
    });

    const unsubscribe = () => {
      socket.off('message', () => {});
    };
    return unsubscribe;
  });
}

function* writeSocket(socket) {
  socket.emit('getGlobalConfig');
  while (true) {

    const { payload } = yield take(ActionTypes.SOCKET_IO_SUBSCRIBE_TIME_FRAME);
    socket.emit(payload && payload.eventName, payload && payload.data);
  }
}

function* watchSocketIoChannel() {
  const socket = yield call(socketConnect, WS_IO_URL);
  yield fork(writeSocket, socket);
  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    const actionIo = yield take(socketChannel);
    yield put(actionIo);
  }
}

// ================================================

export function* wsSagas() {
  yield all([
    // fork(watchSocket),
    fork(watchSocketIoChannel),
  ]);
}
