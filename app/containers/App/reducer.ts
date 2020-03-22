import produce from 'immer';
import { ContainerState } from './types';
import { ActionTypes } from './constants';

// The initial state of the App
export const initialState: ContainerState = {
  loading: false,
  tickers: [],
  error: null,
};

// @ts-ignore
const appReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SOCKET_CONNECT:
      draft.loading = true;
      break;

    case ActionTypes.SOCKET_ERROR:
      draft.loading = false;
      draft.error = action.payload.error;
      break;

    case ActionTypes.SOCKET_MESSAGE:
      draft.loading = false;
      draft.tickers = action.payload.data;
      break;

    default:
      return initialState;
  }
});

export default appReducer;
