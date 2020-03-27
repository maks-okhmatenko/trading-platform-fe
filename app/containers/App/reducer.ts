import produce from 'immer';
import { ContainerState } from './types';
import { ActionTypes } from './constants';

// The initial state of the App
export const initialState: ContainerState = {
  loading: false,
  tickers: {},
  error: null,
  tickersIo: {},
  chartLoading: false,
  chartTimeFrame: [],
  globalConfig: {},
  activeSymbolChart: '',
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
      draft.tickers = { ...draft.tickers, ...action.payload.data };
      break;


    case ActionTypes.SOCKET_IO_CONNECT:
      break;

    case ActionTypes.SOCKET_IO_SUBSCRIBE_TIME_FRAME:
      draft.chartLoading = true;
      break;

    case ActionTypes.SOCKET_IO_INITIAL_TIME_FRAME:
      draft.chartLoading = false;
      draft.chartTimeFrame = action.payload.data;
      break;

    case ActionTypes.SOCKET_IO_APPEND_TIME_FRAME:
      draft.chartTimeFrame = [...draft.chartTimeFrame, ...action.payload.data];
      break;

    case ActionTypes.SOCKET_IO_TICKERS:
      draft.loading = false;
      draft.tickers = {...draft.tickersIo, ...action.payload.data};
      break;

    case ActionTypes.SOCKET_IO_GLOBAL_CONFIG:
      draft.globalConfig = action.payload.data;
      break;

    case ActionTypes.CHANGE_ACTIVE_SYMBOL_CHART:
      draft.activeSymbolChart = action.payload.data;
      break;

    default:
      return draft;
  }
});

export default appReducer;
