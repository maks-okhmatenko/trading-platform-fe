import _sortBy from 'lodash/sortBy';
import _throttle from 'lodash/throttle';
import socketIOClient from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { all, call, fork, put, take, takeEvery, select } from 'redux-saga/effects';

import * as AppActions from '../containers/App/actions';
import {
  ActionTypes,
  EVENT_NAME,
  WS_IO_URL,
  CHANGE_TYPE,
} from '../containers/App/constants';
import { makeSelectActiveSymbolChart } from 'containers/App/selectors';

function transformTickers(data) {
  return data.reduce((acc, curr) => {
    const { Symbol, ...rest } = curr;

    return { ...acc, [Symbol]: rest };
  }, {});
}

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
      emit(AppActions.changeFavoriteSymbolList(CHANGE_TYPE.INIT, config.TICKER_LIST));
    });

    socket.on(EVENT_NAME.ON_INITIAL_TIME_FRAMES, (initialData) => {
      emit(AppActions.socketIoInitialTimeframe(initialData));
    });

    socket.on(EVENT_NAME.ON_APPEND_TIME_FRAME, (dataItem) => {
      emit(AppActions.socketIoAppendTimeframeForward(dataItem));
    });

    socket.on(EVENT_NAME.ON_TIME_FRAME_BY_COUNT, (dataItem) => {
      emit(AppActions.socketIoAppendTimeframeBack(dataItem));
    });

    socket.on(EVENT_NAME.ON_INITIAL_TICKERS, (tickers) => {
      const tickersSorted = transformTickers(tickers);
      emit(AppActions.socketIoTickers(tickersSorted));
    });

    socket.on(EVENT_NAME.ON_UPDATE_TICKERS, (tickers) => {
      const tickersSorted = transformTickers(tickers);
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

  yield all([
    takeEvery(ActionTypes.SOCKET_IO_REQUEST, socketRequest, socket),
    takeEvery(ActionTypes.CHANGE_FAVORITE_SYMBOL_LIST, saveFavoriteSymbolList, socket),
  ]);
}

function* saveFavoriteSymbolList(socket, action) {
  const favSymbolsStr = localStorage.getItem('favorite-symbols');
  let favSymbolList = !favSymbolsStr
                        ? favSymbolsStr === '' // is list empty or not exist
                          ? []
                          : null
                        : favSymbolsStr.split(',');
  const changeType = action.payload.eventType;

  if (changeType === CHANGE_TYPE.INIT) {
    favSymbolList = favSymbolList || action.payload.data;
  }
  if (favSymbolList) {
    if (changeType === CHANGE_TYPE.ADD && typeof action.payload.data === 'string' && favSymbolList) {
      favSymbolList.push(typeof action.payload.data);
    }
    if (changeType === CHANGE_TYPE.DELETE && favSymbolList) {
      const currentSymbol = yield select(makeSelectActiveSymbolChart());
      if (action.payload.data === currentSymbol) {
        yield put(AppActions.changeActiveSymbolChart(''));
      }
      favSymbolList = favSymbolList.filter(item => action.payload.data !== item);
    }

    localStorage.setItem('favorite-symbols', favSymbolList.join(','));
    socket.emit(EVENT_NAME.SUBSCRIBE_TICKERS, { list: favSymbolList });
  }
}

function* socketRequest(socket, action) {
  const { payload } = action;
  socket.emit(payload && payload.eventName, payload && payload.data);
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

export function* rootSagas() {
  yield all([
    fork(watchSocketIoChannel),
  ]);
}
