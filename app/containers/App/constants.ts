import moment from 'moment';

export enum ActionTypes {
  SOCKET_CONNECT = 'App/SOCKET_CONNECT_DONE',
  SOCKET_ERROR = 'App/SOCKET_ERROR',
  SOCKET_MESSAGE = 'App/SOCKET_MESSAGE',

  SOCKET_IO_CONNECT = 'App/SOCKET_IO_CONNECT',
  SOCKET_IO_ERROR = 'App/SOCKET_IO_ERROR',
  SOCKET_IO_INITIAL_TIME_FRAME = 'App/SOCKET_IO_INITIAL_TIME_FRAME',
  SOCKET_IO_APPEND_TIME_FRAME = 'App/SOCKET_IO_APPEND_TIME_FRAME',
  SOCKET_IO_TICKERS = 'App/SOCKET_IO_TICKERS',
  SOCKET_IO_SUBSCRIBE_TIME_FRAME = 'App/SOCKET_IO_SUBSCRIBE_TIME_FRAME',
  SOCKET_IO_GLOBAL_CONFIG = 'App/SOCKET_IO_GLOBAL_CONFIG',
  CHANGE_ACTIVE_SYMBOL_CHART = 'App/CHANGE_ACTIVE_SYMBOL_CHART',
}

export const WS_URL = 'ws://85.17.172.72:1189';
export const WS_IO_URL = 'ws://localhost:8080';

export enum EVENT_NAME {
  GET_GLOBAL_CONFIG = 'getGlobalConfig',
  SUBSCRIBE_TIME_FRAME = 'subscribeTimeframe',
  SUBSCRIBE_TICKERS = 'subscribeTickers',

  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ON_GLOBAL_CONFIG = 'onGlobalConfig',
  ON_INITIAL_TIME_FRAMES = 'onInitialTimeframes',
  ON_APPEND_TIME_FRAME = 'onAppendTimeframe',
  ON_INITIAL_TICKERS = 'onInitialTickers',
  ON_UPDATE_TICKERS = 'onUpdateTickers',
}

export enum FRAME_TYPES {
  M1 = 'M1',
  M5 = 'M5',
  M15 = 'M15',
  M30 = 'M30',
  H1 = 'H1',
  H4 = 'H4',
  D1 = 'D1',
}

export const DEFAULT_TIME_FRAME = 'H1';

export const TIME_FRAMES_CONFIG = { // object key should be the same with FRAME_TYPES values
  M1: {
    from: moment().subtract(1, 'day').unix(),
    to: moment().add(2, 'h').unix(),
  },
  M5: {
    from: moment().subtract(1, 'day').unix(),
    to: moment().add(2, 'h').unix(),
  },
  M15: {
    from: moment().subtract(1, 'day').unix(),
    to: moment().add(2, 'h').unix(),
  },
  M30: {
    from: moment().subtract(1, 'day').unix(),
    to: moment().add(2, 'h').unix(),
  },
  H1: {
    from: moment().subtract(4, 'day').unix(),
    to: moment().add(2, 'h').unix(),
  },
  H4: {
    from: moment().subtract(15, 'day').unix(),
    to: moment().add(2, 'h').unix(),
  },
  D1: {
    from: moment().subtract(90, 'day').unix(),
    to: moment().add(2, 'h').unix(),
  },
};
