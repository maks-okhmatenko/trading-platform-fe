import { ActionType } from 'typesafe-actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */

interface HomeState {
  readonly username: string;
}

/* --- ACTIONS --- */


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = HomeState;

export { RootState, ContainerState };
