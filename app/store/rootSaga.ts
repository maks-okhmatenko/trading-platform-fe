import _sortBy from 'lodash/sortBy';
import _throttle from 'lodash/throttle';
import socketIOClient from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { all, call, fork, put, take } from 'redux-saga/effects';

import { initWebSocket } from '../api/socket';
import * as AppActions from '../containers/App/actions';
import {
  ActionTypes,
  DEFAULT_TIME_FRAME,
  EVENT_NAME,
  FRAME_TYPES, getTimestamp,
  TIME_FRAMES_CONFIG,
  WS_IO_URL,
} from '../containers/App/constants';

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

    socket.on(EVENT_NAME.CONNECT, () => {
      console.log('Socket IO connected');
      emit(AppActions.socketIoConnect());
    });

    socket.once(EVENT_NAME.ON_GLOBAL_CONFIG, (config) => {
      emit(AppActions.socketIoGlobalConfig(config));

      emit(AppActions.socketIoSubscribeTimeframe(EVENT_NAME.SUBSCRIBE_TIME_FRAME, {
        symbol: config.TICKER_LIST[0],
        frameType: FRAME_TYPES[DEFAULT_TIME_FRAME],
        from: getTimestamp.subtract(TIME_FRAMES_CONFIG[DEFAULT_TIME_FRAME].from),
        to: getTimestamp.add(TIME_FRAMES_CONFIG[DEFAULT_TIME_FRAME].to),
      }));

      emit(AppActions.changeActiveSymbolChart(config.TICKER_LIST[0]));
    });

    socket.on(EVENT_NAME.ON_INITIAL_TIME_FRAMES, (initialData) => {
      emit(AppActions.socketIoInitialTimeframe(initialData));
    });

    socket.on(EVENT_NAME.ON_APPEND_TIME_FRAME, (dataItem) => {
      emit(AppActions.socketIoAppendTimeframe(dataItem));
    });

    socket.on(EVENT_NAME.ON_INITIAL_TICKERS, (tickers) => {
      const sorted = _sortBy(tickers, 'Bid').reverse();
      const tickersSorted = transformTickers(sorted);
      emit(AppActions.socketIoTickers(tickersSorted));
    });

    socket.on(EVENT_NAME.ON_UPDATE_TICKERS, (tickers) => {
      const sorted = _sortBy(tickers, 'Bid').reverse();
      const tickersSorted = transformTickers(sorted);
      emit(AppActions.socketIoTickers(tickersSorted));
    });

    socket.on(EVENT_NAME.DISCONNECT, () => {
      socket.off(EVENT_NAME.ON_APPEND_TIME_FRAME);
      socket.off(EVENT_NAME.ON_UPDATE_TICKERS);
    });

    const unsubscribe = () => {
      socket.off(EVENT_NAME.ON_APPEND_TIME_FRAME);
      socket.off(EVENT_NAME.ON_UPDATE_TICKERS);
    };
    return unsubscribe;
  });
}

function* writeSocket(socket) {
  socket.emit(EVENT_NAME.GET_GLOBAL_CONFIG);
  socket.emit(EVENT_NAME.SUBSCRIBE_TICKERS);
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
