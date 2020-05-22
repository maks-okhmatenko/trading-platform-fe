import _sortBy from 'lodash/sortBy';
import _throttle from 'lodash/throttle';
import socketIOClient from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { all, call, fork, put, take, takeEvery, select, takeLatest, delay } from 'redux-saga/effects';

import * as AppActions from '../containers/App/actions';
import {
  ActionTypes,
  EVENT_NAME,
  WS_WORKER_URL,
  CHANGE_TYPE,
  ORDER_API_URL,
  ORDER_ACTION,
  ALERT_TYPES,
} from '../containers/App/constants';
import {
  makeSelectFavoriteTickers, makeSelectLogin, makeSelectGlobalSymbolList,
} from 'containers/App/selectors';
import moment from 'moment';

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
      emit(AppActions.changeFavoriteSymbolList(CHANGE_TYPE.INIT));
    });

    socket.on(EVENT_NAME.ON_INITIAL_TIME_FRAMES, (initialData) => {
      emit(AppActions.socketIoInitialTimeFrame(initialData));
    });

    socket.on(EVENT_NAME.ON_APPEND_TIME_FRAME, (dataItem) => {
      emit(AppActions.socketIoAppendTimeFrameForward(dataItem));
    });

    socket.on(EVENT_NAME.ON_TIME_FRAME_BY_COUNT, (dataItem) => {
      emit(AppActions.socketIoAppendTimeFrameBack(dataItem));
    });

    socket.on(EVENT_NAME.ON_INITIAL_TICKERS, (tickers) => {
      const tickersSorted = transformTickers(tickers);
      emit(AppActions.initTickers(tickersSorted));
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
    takeEvery([ActionTypes.CHANGE_FAVORITE_SYMBOL_LIST], subscribeTickers, socket),
  ]);
}

function* subscribeTickers(socket) {
  // const tickersToSub = yield select(makeSelectFavoriteTickers());
  const tickersToSub = yield select(makeSelectGlobalSymbolList());

  socket.emit(EVENT_NAME.SUBSCRIBE_TICKERS, { list: tickersToSub });
}

function* socketRequest(socket, action) {
  const { payload } = action;
  socket.emit(payload && payload.eventName, payload && payload.data);
}

function* watchSocketIoChannel() {
  const socket = yield call(socketConnect, WS_WORKER_URL);
  yield fork(writeSocket, socket);
  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    const actionIo = yield take(socketChannel);
    yield put(actionIo);
  }
}

async function httpRequest(url: string, data) {
  const formData = new FormData();

  // tslint:disable-next-line: forin
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return fetch(url, {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      alert('Something went wrong during order list loading...');
      return [];
    }
  });
}

function* openOrderSaga(action) {
  const requestData = {
    action: ORDER_ACTION.OPEN,
    ...action.payload,
  };
  const data = yield call(httpRequest, ORDER_API_URL, requestData);
  if (data && data.status) {
    const order = {
      id: data.message,
      OpenTime: moment(moment.now()).unix(),
      ...action.payload,
    };
    yield put(AppActions.openOrderResult(order, 'Order opened', ALERT_TYPES.SUCCESS));
  } else {
    yield put(AppActions.openOrderResult(null, 'Can\'t open order', ALERT_TYPES.ERROR));
  }
  yield delay(3500);
  yield put(AppActions.openOrderResult());
}

function* closeOrderSaga(action) {
  const requestData = {
    action: ORDER_ACTION.CLOSE,
    Orders: [action.payload],
  };
  const data = yield call(httpRequest, ORDER_API_URL, requestData);
  if (data && data.message) {
    yield put(AppActions.closeOrderSuccess(action.payload.id));
  }
}

function* updateOrderSaga(action) {
  const requestData = {
    action: ORDER_ACTION.UPDATE,
    ...action.payload,
  };
  const data = yield call(httpRequest, ORDER_API_URL, requestData);
  if (data && data.message) {
    yield put(AppActions.closeOrderSuccess(action.payload.id));
  }
}

function* loadOrdersSaga(action) {
  const { payload: type } = action;
  const login = yield select(makeSelectLogin());

  const requestData = {
    action: type,
    account_number: login,
  };

  const data = yield call(httpRequest, ORDER_API_URL, requestData);

  if (data && data.message) {
    console.log(data);
    if (type === ORDER_ACTION.OPENED) {
      yield put(AppActions.loadOpenOrdersSuccess(data.message));
    }
    if (type === ORDER_ACTION.CLOSED) {
      yield put(AppActions.loadHistoryOrdersSuccess(data.message));
    }
  }
}

export function* rootSagas() {
  yield put(AppActions.openOrderResult());
  yield all([
    fork(watchSocketIoChannel),
    takeEvery(ActionTypes.OPEN_NEW_ORDER, openOrderSaga),
    takeEvery(ActionTypes.CLOSE_ORDER, closeOrderSaga),
    takeEvery(ActionTypes.UPDATE_ORDER, updateOrderSaga),

    takeEvery(ActionTypes.LOAD_OPEN_ORDERS, loadOrdersSaga),
    takeEvery(ActionTypes.LOAD_HISTORY_ORDERS, loadOrdersSaga),
  ]);
}
