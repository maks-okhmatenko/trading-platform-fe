import _sortBy from 'lodash/sortBy';
import { eventChannel } from 'redux-saga';
import { call, take, put } from 'redux-saga/effects';

import { initWebSocket } from '../api/socket';
import * as AppActions from '../containers/App/actions';
import _throttle from 'lodash/throttle';

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

export function* wsSagas() {
  const channel = yield call(initSocketSaga);

  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}
