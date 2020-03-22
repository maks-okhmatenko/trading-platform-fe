import { ActionTypes } from './constants';

export const socketConnect = () => ({
    type: ActionTypes.SOCKET_CONNECT,
});

export const socketError = (error) => ({
  type: ActionTypes.SOCKET_ERROR,
  payload: { error },
});

export const socketMessage = (data) => ({
  type: ActionTypes.SOCKET_MESSAGE,
  payload: { data },
});
