import { eventChannel } from 'redux-saga';
import { call, take, put } from 'redux-saga/effects';

import { initWebSocket } from '../api/socket';
import * as AppActions from '../containers/App/actions';

function initSocketSaga() {
  return eventChannel(emitter => {
    const socketParams = {
      onOpen: () => emitter(AppActions.socketConnect()),
      onError: (error) => emitter(AppActions.socketError(error)),
      onMessage: (data) => emitter(AppActions.socketMessage(data)),
    };

    initWebSocket(socketParams);

    return () => {
      // do whatever to interrupt the socket communication here
    };
  });
}

export function* wsSagas() {
  const channel = yield call(initSocketSaga);

  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}
