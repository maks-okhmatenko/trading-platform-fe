import { action } from 'typesafe-actions';

import ActionTypes from './constants';

export enum actionsType {
  subscribeSocket = 'SOCKET_INIT_SUBSCRIPTION',
}

export const loadRepos = () => action(ActionTypes.LOAD_REPOS);
export const repoLoadingError = (error: object) =>
  action(ActionTypes.LOAD_REPOS_ERROR, error);

export const subscribeSocket = () => action(actionsType.subscribeSocket);
