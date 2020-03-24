/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 */

export enum ActionTypes {
  LOAD_REPOS = 'App/LOAD_REPOS',

  SOCKET_CONNECT = 'App/SOCKET_CONNECT_DONE',
  SOCKET_ERROR = 'App/SOCKET_ERROR',
  SOCKET_MESSAGE = 'App/SOCKET_MESSAGE',
}

export const WS_URL = 'ws://85.17.172.72:1189';
