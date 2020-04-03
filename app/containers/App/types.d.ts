import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from '../../types';
import { FRAME_TYPES } from './constants';

/* --- STATE --- */

interface AppState {
  loading: boolean;
  error: any;
  tickers: {};
  tickersIo: {};
  chartLoading: boolean;
  chartTimeFrame: {};
  globalConfig: {};
  activeSymbolChart: string;
  activeTimeFrame: FRAME_TYPES;
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
