import produce from 'immer';
import { ContainerState } from './types';
import { ActionTypes, APPEND_TYPE } from './constants';

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

    case ActionTypes.SOCKET_IO_REQUEST:
      draft.chartLoading = true;
      break;

    case ActionTypes.SOCKET_IO_INITIAL_TIME_FRAME:
      draft.chartLoading = false;
      draft.chartTimeFrame = action.payload.data;
      break;

    case ActionTypes.SOCKET_IO_APPEND_TIME_FRAME:
      if (action.payload.appendTo === APPEND_TYPE.BACK) {
        draft.chartTimeFrame = [...action.payload.data, ...draft.chartTimeFrame];
      } else if (action.payload.appendTo === APPEND_TYPE.FORWARD) {
          const lastIdx = draft.chartTimeFrame.length - 1;
          if (draft.chartTimeFrame[lastIdx].x === action.payload.data.x) {
            draft.chartTimeFrame[lastIdx] = action.payload.data;
          } else if (draft.chartTimeFrame[lastIdx].x < action.payload.data.x) {
            draft.chartTimeFrame = [...draft.chartTimeFrame, ...action.payload.data];
          }
      }
      break;

    case ActionTypes.SOCKET_IO_TICKERS:
      draft.loading = false;
      draft.tickers = { ...draft.tickers, ...action.payload.data };
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
