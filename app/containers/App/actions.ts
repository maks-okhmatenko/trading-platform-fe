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
  payload: { data },
});

export const socketIoAppendTimeframeBack = (data) => ({
  type: ActionTypes.SOCKET_IO_APPEND_TIME_FRAME,
  payload: { appendTo: APPEND_TYPE.BACK, data },
});

export const socketIoAppendTimeframeForward = (data) => ({
  type: ActionTypes.SOCKET_IO_APPEND_TIME_FRAME,
  payload: { appendTo: APPEND_TYPE.FORWARD, data },
});

export const socketIoLoadTimeFrameByRange = (data: socketIoSubscribeTimeframeProps) => ({
  type: ActionTypes.SOCKET_IO_REQUEST,
  payload: { eventName: EVENT_NAME.SUBSCRIBE_TIME_FRAME, data },
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
