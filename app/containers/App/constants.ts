import moment from 'moment';

export const WS_URL = 'ws://85.17.172.72:1189';
export const WS_IO_URL = 'http://35.207.78.105:8082'; // 'http://localhost:8080';
export const ORDER_API_URL = 'http://test.greathead.net/order.php';

export enum ActionTypes {
  SOCKET_CONNECT = 'App/SOCKET_CONNECT_DONE',
  SOCKET_ERROR = 'App/SOCKET_ERROR',

  SOCKET_IO_CONNECT = 'App/SOCKET_IO_CONNECT',
  SOCKET_IO_ERROR = 'App/SOCKET_IO_ERROR',
  SOCKET_IO_INITIAL_TIME_FRAME = 'App/SOCKET_IO_INITIAL_TIME_FRAME',
  SOCKET_IO_APPEND_TIME_FRAME = 'App/SOCKET_IO_APPEND_TIME_FRAME',
  SOCKET_INITIAL_TICKERS = 'App/SOCKET_INITIAL_TICKERS',
  SOCKET_IO_TICKERS = 'App/SOCKET_IO_TICKERS',
  SOCKET_IO_REQUEST = 'App/SOCKET_IO_REQUEST',
  SOCKET_IO_GLOBAL_CONFIG = 'App/SOCKET_IO_GLOBAL_CONFIG',
  CHANGE_ACTIVE_SYMBOL_CHART_LIST = 'App/CHANGE_ACTIVE_SYMBOL_CHART_LIST',
  CHANGE_ACTIVE_TIME_FRAME = 'App/CHANGE_ACTIVE_TIME_FRAME',
  SOCKET_IO_LOAD_TIME_FRAME_BY_RANGE = 'App/SOCKET_IO_LOAD_TIME_FRAMES_BY_RANGE',

  CHANGE_FAVORITE_SYMBOL_LIST = 'App/CHANGE_FAVORITE_SYMBOL_LIST',

  OPEN_NEW_ORDER = 'App/OPEN_NEW_ORDER',
  OPEN_ORDER_SUCCESS = 'App/OPEN_ORDER_SUCCESS',
  CLOSE_ORDER = 'App/CLOSE_ORDER',
  CLOSE_ORDER_SUCCESS = 'App/CLOSE_ORDER_SUCCESS',
}

export enum EVENT_NAME {
  GET_GLOBAL_CONFIG = 'getGlobalConfig',
  SUBSCRIBE_TIME_FRAME_INIT_BY_RANGE = 'subscribeTimeframe',
  SUBSCRIBE_TIME_FRAME_INIT_BY_COUNT = 'subscribeTimeframeInitByCount',
  SUBSCRIBE_TICKERS = 'subscribeTickers',

  GET_TIME_FRAME_BY_RANGE = 'getTimeframeByRange',
  GET_TIME_FRAME_BY_COUNT = 'getTimeframeByCount',

  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ON_GLOBAL_CONFIG = 'onGlobalConfig',
  ON_INITIAL_TIME_FRAMES = 'onInitialTimeframes',
  ON_APPEND_TIME_FRAME = 'onAppendTimeframe',
  ON_INITIAL_TICKERS = 'onInitialTickers',
  ON_UPDATE_TICKERS = 'onUpdateTickers',
  ON_TIME_FRAME_BY_COUNT = 'onTimeframeByCount',
  ON_TIME_FRAME_BY_RANGE = 'onTimeframeByRange',
}

export enum APPEND_TYPE {
  ADDITIONAL = 0,
  MAIN = 1,
}

export enum CHANGE_TYPE {
  INIT = 'INIT',
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export enum ORDER_TYPE {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
}

export enum SIDE_TYPE {
  BUY = 'buy',
  SELL = 'sell',
}

export type ORDER_ITEM_TYPE = {
  id: string,
  date: number,
  symbol: string,
  volume: string,
  side: SIDE_TYPE,
  openPrice: string,
  currentPrice: string,
  stopLoss: string,
  takeProfit: string,
  swap: string,
  commission: string,
  netProfit: string,
};

export type ORDER = {
  id?: string,
  Login: string,
  Volume: string,
  Symbol: string,
  Price: string,
  Sl?: string,
  Tp?: string,
  Cmd: SIDE_TYPE,
};

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
export const candlesLoad = 1920 / candleWidth;
export const candlesShow = candlesLoad / 2;

export const TIME_FRAMES_CONFIG = { // object key should be the same with FRAME_TYPES values
  M1: {
    from: TIME_IN_SECONDS.MINUTE,
    to: TIME_IN_SECONDS.MINUTE,
  },
  M5: {
    from: TIME_IN_SECONDS.MINUTE * 5,
    to: TIME_IN_SECONDS.MINUTE * 5,
  },
  M15: {
    from: TIME_IN_SECONDS.MINUTE * 15,
    to: TIME_IN_SECONDS.MINUTE * 15,
  },
  M30: {
    from: TIME_IN_SECONDS.MINUTE * 30,
    to: TIME_IN_SECONDS.MINUTE * 30,
  },
  H1: {
    from: TIME_IN_SECONDS.HOUR,
    to: TIME_IN_SECONDS.HOUR,
  },
  H4: {
    from: TIME_IN_SECONDS.HOUR * 4,
    to: TIME_IN_SECONDS.HOUR * 4,
  },
  D1: {
    from: TIME_IN_SECONDS.DAY,
    to: TIME_IN_SECONDS.DAY,
  },
};
