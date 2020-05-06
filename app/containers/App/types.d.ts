import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from '../../types';
import { FRAME_TYPES } from './constants';

/* --- STATE --- */

interface AppState {
  loading: boolean;
  error: any;
  tickers: {};
  chartLoading: boolean;
  chartTimeFrame: [];
  additionalChartDataLength: number;
  globalConfig: { TICKER_LIST: [] };
  openedSymbols: [];
  favoriteTickers: [];
  activeSymbolChart: string;
  activeTimeFrame: FRAME_TYPES;

  ordersLoading: boolean;
  openOrders: [];
  historyOrders: [];

  login: string;
}

interface UserData {
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = AppState;
type ContainerActions = AppActions;

export { RootState, ContainerState, ContainerActions, UserData };
