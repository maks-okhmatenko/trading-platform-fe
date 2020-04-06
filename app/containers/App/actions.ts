import { ActionTypes, EVENT_NAME, FRAME_TYPES, APPEND_TYPE } from './constants';

type socketIoSubscribeTimeframeProps = {
  symbol: string;
  frameType: FRAME_TYPES;
  from: number;
  to: number;
};

export const socketConnect = () => ({
    type: ActionTypes.SOCKET_CONNECT,
});

export const socketError = (error) => ({
  type: ActionTypes.SOCKET_ERROR,
  payload: { error },
});

export const socketMessage = (data) => ({
  type: ActionTypes.SOCKET_MESSAGE,
  payload: { data },
});


export const socketIoConnect = () => ({
  type: ActionTypes.SOCKET_IO_CONNECT,
});

export const socketIoError = (error) => ({
  type: ActionTypes.SOCKET_IO_ERROR,
  payload: { error },
});

export const socketIoInitialTimeframe = (data) => ({
  type: ActionTypes.SOCKET_IO_INITIAL_TIME_FRAME,
  payload: { data: transformData(data) },
});

export const socketIoAppendTimeframeBack = (data) => ({
  type: ActionTypes.SOCKET_IO_APPEND_TIME_FRAME,
  payload: { appendTo: APPEND_TYPE.ADDITIONAL, data: transformData(data) },
});

export const socketIoAppendTimeframeForward = (data) => ({
  type: ActionTypes.SOCKET_IO_APPEND_TIME_FRAME,
  payload: { appendTo: APPEND_TYPE.MAIN, data: transformData(data) },
});

export const socketIoLoadTimeFrameByRange = (data: socketIoSubscribeTimeframeProps) => ({
  type: ActionTypes.SOCKET_IO_REQUEST,
  payload: { eventName: EVENT_NAME.GET_TIME_FRAME_BY_RANGE, data },
});

export const socketIoTickers = (data) => ({
  type: ActionTypes.SOCKET_IO_TICKERS,
  payload: { data },
});

export const socketIoSubscribeTimeframe = (data: socketIoSubscribeTimeframeProps) => ({
  type: ActionTypes.SOCKET_IO_REQUEST,
  payload: { eventName: EVENT_NAME.SUBSCRIBE_TIME_FRAME, data },
});

export const socketIoGlobalConfig = (data) => ({
  type: ActionTypes.SOCKET_IO_GLOBAL_CONFIG,
  payload: { data },
});

export const changeActiveSymbolChart = (data) => ({
  type: ActionTypes.CHANGE_ACTIVE_SYMBOL_CHART,
  payload: { data },
});

export const changeActiveTimeFrame = (data) => ({
  type: ActionTypes.CHANGE_ACTIVE_TIME_FRAME,
  payload: { data },
});


const chartDataTransformer = (item) => ({
  date: new Date(parseInt(item.x, 10) * 1000),
  open: parseFloat(item.y[0]),
  high: parseFloat(item.y[1]),
  low: parseFloat(item.y[2]),
  close: parseFloat(item.y[3]),
  volume: 0,
  split: '',
  dividend: '',
  absoluteChange: '',
  percentChange: '',
});

const transformData = (chartData) => {
  if (Array.isArray(chartData)) {
    return chartData.map(chartDataTransformer);
  } else {
    return chartDataTransformer(chartData);
  }
};
