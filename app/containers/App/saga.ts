import { eventChannel } from 'redux-saga';
import { fork, take, call, put, cancel, takeLatest, takeEvery, all } from 'redux-saga/effects';
import { WS_URL } from '../../constants/apiUrl';
import { socketConnect } from '../../api/socket';
import { actionsType } from './actions';

function subscribe(socket) {
  return eventChannel(emit => {
    socket.on('users.login', ({ username }) => {
      // emit(addUser({ username }));
    });
    socket.on('users.logout', ({ username }) => {
      // emit(removeUser({ username }));
    });
    socket.on('messages.new', ({ message }) => {
      // emit(newMessage({ message }));
    });
    socket.on('disconnect', e => {
      // TODO: handle
    });

    socket.on('messages', ({ message }) => {
      // emit(newMessage({ message }));
      console.log('message', message);
    });
    return () => {};
  });
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    const action = yield take(channel);
    console.log('action', action);
    yield put(action);
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
}

function* flow() {
  const params = {
    transports: ['websocket'],
  };
  const socket = yield call(socketConnect, WS_URL, params);
  // const socket = yield call(socketConnect, 'ws://localhost:4000', params);
  const task = yield call(handleIO, socket);
  console.log('task', task);
}

function* watchFlow() {
  yield takeEvery(actionsType.subscribeSocket, flow);
}

export default function* rootSaga() {
  yield all([
    fork(watchFlow),
  ]);
}

