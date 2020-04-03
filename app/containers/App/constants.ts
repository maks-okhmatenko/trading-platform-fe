import moment from 'moment';

export enum APPEND_TYPE {
  BACK = 0,
  FORWARD = 1,
}

export enum ActionTypes {
  SOCKET_CONNECT = 'App/SOCKET_CONNECT_DONE',
  SOCKET_ERROR = 'App/SOCKET_ERROR',
  SOCKET_MESSAGE = 'App/SOCKET_MESSAGE',

  SOCKET_IO_CONNECT = 'App/SOCKET_IO_CONNECT',
  SOCKET_IO_ERROR = 'App/SOCKET_IO_ERROR',
  SOCKET_IO_INITIAL_TIME_FRAME = 'App/SOCKET_IO_INITIAL_TIME_FRAME',
  SOCKET_IO_APPEND_TIME_FRAME = 'App/SOCKET_IO_APPEND_TIME_FRAME',
  SOCKET_IO_TICKERS = 'App/SOCKET_IO_TICKERS',
  SOCKET_IO_REQUEST = 'App/SOCKET_IO_REQUEST',
  SOCKET_IO_GLOBAL_CONFIG = 'App/SOCKET_IO_GLOBAL_CONFIG',
  CHANGE_ACTIVE_SYMBOL_CHART = 'App/CHANGE_ACTIVE_SYMBOL_CHART',
  SOCKET_IO_LOAD_TIME_FRAME_BY_RANGE = 'App/SOCKET_IO_LOAD_TIME_FRAMES_BY_RANGE',
}

export const WS_URL = 'ws://85.17.172.72:1189';
export const WS_IO_URL = 'http://35.207.78.105:8080/'; // 'ws://localhost:8080';

export enum EVENT_NAME {
  GET_GLOBAL_CONFIG = 'getGlobalConfig',
  SUBSCRIBE_TIME_FRAME = 'subscribeTimeframe',
  SUBSCRIBE_TICKERS = 'subscribeTickers',

  GET_TIME_FRAME_BY_RANGE = 'getTimeframeByRange',

  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ON_GLOBAL_CONFIG = 'onGlobalConfig',
  ON_INITIAL_TIME_FRAMES = 'onInitialTimeframes',
  ON_APPEND_TIME_FRAME = 'onAppendTimeframe',
  ON_INITIAL_TICKERS = 'onInitialTickers',
  ON_UPDATE_TICKERS = 'onUpdateTickers',
  ON_TIME_FRAME_BY_RANGE = 'onTimeframeByRange',
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

export const DEFAULT_TIME_FRAME = FRAME_TYPES.H1;

export const TIME_IN_SECONDS = {
  MINUTE: 60, // 1 minute
  HOUR: 3600, // 1 hour
  DAY: 86400, // 1 day
  WEEK: 604800, // 1 week
  MONTH: 2629743, // 1 month (30.44 days)
};

export const getTimestamp = {
  subtract: (offset, timestamp?: string | number) => {
    if (timestamp) {
      return moment.unix(Number(timestamp)).unix() - offset;
    }
    return moment().unix() - offset;
  },
  add: (offset, timestamp?: string | number) => {
    if (timestamp) {
      return moment.unix(Number(timestamp)).unix() + offset;
    }
    return moment().unix() + offset;
  },
};

export const candleWidth = 20;
export const candlesShow = 1920 / candleWidth;
export const candlesLoad = candlesShow * 1.5;

export const TIME_FRAMES_CONFIG = { // object key should be the same with FRAME_TYPES values
  M1: {
    from: TIME_IN_SECONDS.MINUTE * candlesLoad,
    to: TIME_IN_SECONDS.MINUTE * candlesLoad,
  },
  M5: {
    from: TIME_IN_SECONDS.MINUTE * 5 * candlesLoad,
    to: TIME_IN_SECONDS.MINUTE * 5 * candlesLoad,
  },
  M15: {
    from: TIME_IN_SECONDS.MINUTE * 15 * candlesLoad,
    to: TIME_IN_SECONDS.MINUTE * 15 * candlesLoad,
  },
  M30: {
    from: TIME_IN_SECONDS.MINUTE * 30 * candlesLoad,
    to: TIME_IN_SECONDS.MINUTE * 30 * candlesLoad,
  },
  H1: {
    from: TIME_IN_SECONDS.HOUR * candlesLoad,
    to: TIME_IN_SECONDS.HOUR * candlesLoad,
  },
  H4: {
    from: TIME_IN_SECONDS.HOUR * 4 * candlesLoad,
    to: TIME_IN_SECONDS.HOUR * 4 * candlesLoad,
  },
  D1: {
    from: TIME_IN_SECONDS.DAY * candlesLoad,
    to: TIME_IN_SECONDS.DAY * candlesLoad,
  },
};
