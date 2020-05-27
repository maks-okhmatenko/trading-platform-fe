import produce from 'immer';
import { ContainerState } from './types';
import { ActionTypes, APPEND_TYPE, DEFAULT_TIME_FRAME, CHANGE_TYPE } from './constants';

// The initial state of the App
export const initialState: ContainerState = {
  chartLoading: false,
  loading: false,
  error: null,

  globalConfig: { TICKER_LIST: [] },
  tickers: {},
  openedSymbols: [],
  favoriteTickers: [],
  activeSymbolChart: '',
  activeTimeFrame: DEFAULT_TIME_FRAME,

  chartTimeFrame: [],
  additionalChartDataLength: 0,

  ordersLoading: false,
  openOrderError: null,
  openOrders: [],
  historyOrders: [],

  login: '2100089166',
};

const appReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SOCKET_CONNECT:
      draft.loading = true;
      break;

    case ActionTypes.SOCKET_ERROR:
      draft.loading = false;
      draft.error = action.payload.error;
      break;

    case ActionTypes.SOCKET_INITIAL_TICKERS:
      draft.loading = false;
      draft.tickers = action.payload.data;
      break;


    case ActionTypes.SOCKET_IO_CONNECT:
      break;

    case ActionTypes.SOCKET_IO_REQUEST:
      draft.chartLoading = true;
      break;

    case ActionTypes.SOCKET_IO_INITIAL_TIME_FRAME:
      draft.chartLoading = false;
      draft.chartTimeFrame = action.payload.data;
      draft.additionalChartDataLength = 0;
      break;

    case ActionTypes.SOCKET_IO_APPEND_TIME_FRAME:
      if (action.payload.appendTo === APPEND_TYPE.ADDITIONAL) {
        const additionalData = action.payload.data;
        if (additionalData.length < 1) { return draft; }

        const lastItemId = action.payload.data.length - 1;
        if (additionalData[lastItemId].date.getTime() >= draft.chartTimeFrame[0].date.getTime()) {
          return draft;
        }
        draft.chartTimeFrame = [...action.payload.data, ...draft.chartTimeFrame];
        draft.additionalChartDataLength += action.payload.data.length;

      } else if (action.payload.appendTo === APPEND_TYPE.MAIN) {
        const lastIdx = draft.chartTimeFrame.length - 1;
        if (lastIdx >= 0) {
          if (draft.chartTimeFrame[lastIdx].date.getTime() === action.payload.data.date.getTime()) {
            draft.chartTimeFrame[lastIdx] = action.payload.data;
          } else if (draft.chartTimeFrame[lastIdx].date.getTime() < action.payload.data.date.getTime()) {
            draft.chartTimeFrame.push(action.payload.data);
          }
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

    case ActionTypes.CHANGE_ACTIVE_SYMBOL_CHART_LIST:
      const eventType = action.payload.eventType;
      const symbolToChange = action.payload.data;
      if (eventType === CHANGE_TYPE.ADD) {
        draft.activeSymbolChart = symbolToChange;
      }
      if (!draft.openedSymbols.find(item => item === symbolToChange)) {
        draft.openedSymbols.unshift(symbolToChange);
      } else {
        if (eventType === CHANGE_TYPE.DELETE) {
          draft.openedSymbols = draft.openedSymbols.filter(item => item !== symbolToChange);
          if (draft.activeSymbolChart === symbolToChange) {
            draft.activeSymbolChart = draft.openedSymbols[0] || '';
          }
        }
      }
      break;

    case ActionTypes.CHANGE_FAVORITE_SYMBOL_LIST:
      const favSymbolsStr = localStorage.getItem('favorite-symbols');
      const favSymbolList = !favSymbolsStr
                              ? favSymbolsStr === ''
                                ? []
                                : draft.globalConfig.TICKER_LIST.slice(0, 5)
                              : favSymbolsStr.split(',');
      const changeType = action.payload.eventType;

      draft.favoriteTickers = favSymbolList;
      if (changeType === CHANGE_TYPE.INIT && action.payload.data) {
        if (Array.isArray(action.payload.data)) {
          draft.favoriteTickers = action.payload.data;
        }
      }
      if (changeType === CHANGE_TYPE.ADD && typeof action.payload.data === 'string' && favSymbolList) {
        draft.favoriteTickers.push(action.payload.data);
      }
      if (changeType === CHANGE_TYPE.DELETE && favSymbolList) {
        draft.favoriteTickers = draft.favoriteTickers.filter(item => action.payload.data !== item);
      }
      localStorage.setItem('favorite-symbols', draft.favoriteTickers.join(','));
      break;

    case ActionTypes.CHANGE_ACTIVE_TIME_FRAME:
      draft.activeTimeFrame = action.payload.data;
      break;

    case ActionTypes.OPEN_NEW_ORDER:
    case ActionTypes.CLOSE_ORDER:
      draft.ordersLoading = true;
      break;

    case ActionTypes.OPEN_ORDER_RESULT:
    case ActionTypes.CLOSE_ORDER_RESULT:
    case ActionTypes.UPDATE_ORDER_RESULT:
      draft.ordersLoading = false;
      draft.openOrderError = action.payload.error;
      break;

    case ActionTypes.LOAD_OPEN_ORDERS_SUCCESS:
      draft.openOrders = action.payload;
      break;

    case ActionTypes.LOAD_HISTORY_ORDERS_SUCCESS:
      draft.historyOrders = action.payload;
      break;

    default:
      return draft;
  }
});

export default appReducer;
