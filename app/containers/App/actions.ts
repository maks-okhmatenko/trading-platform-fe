import {
  ActionTypes,
  EVENT_NAME,
  FRAME_TYPES,
  APPEND_TYPE,
  CHANGE_TYPE,
  ORDER,
  ORDER_ACTION,
  ALERT_TYPES,
} from './constants';
import { transformChartData } from './utils';

type socketIoSubscribeTimeFrameProps = {
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

export const socketIoConnect = () => ({
  type: ActionTypes.SOCKET_IO_CONNECT,
});

export const socketIoError = (error) => ({
  type: ActionTypes.SOCKET_IO_ERROR,
  payload: { error },
});

export const socketIoInitialTimeFrame = (data) => ({
  type: ActionTypes.SOCKET_IO_INITIAL_TIME_FRAME,
  payload: { data: transformChartData(data) },
});

export const socketIoAppendTimeFrameBack = (data) => ({
  type: ActionTypes.SOCKET_IO_APPEND_TIME_FRAME,
  payload: { appendTo: APPEND_TYPE.ADDITIONAL, data: transformChartData(data) },
});

export const socketIoAppendTimeFrameForward = (data) => ({
  type: ActionTypes.SOCKET_IO_APPEND_TIME_FRAME,
  payload: { appendTo: APPEND_TYPE.MAIN, data: transformChartData(data) },
});

export const socketIoLoadTimeFrameByCount = (data: socketIoSubscribeTimeFrameProps) => ({
  type: ActionTypes.SOCKET_IO_REQUEST,
  payload: { eventName: EVENT_NAME.GET_TIME_FRAME_BY_COUNT, data },
});

export const initTickers = (data) => ({
  type: ActionTypes.SOCKET_INITIAL_TICKERS,
  payload: { data },
});

export const socketIoTickers = (data) => ({
  type: ActionTypes.SOCKET_IO_TICKERS,
  payload: { data },
});

export const socketIoSubscribeTimeFrame = (data: socketIoSubscribeTimeFrameProps) => ({
  type: ActionTypes.SOCKET_IO_REQUEST,
  payload: { eventName: EVENT_NAME.SUBSCRIBE_TIME_FRAME_INIT_BY_RANGE, data },
});

export const socketIoSubscribeTimeframeInitByCount = (data: socketIoSubscribeTimeFrameProps) => ({
  type: ActionTypes.SOCKET_IO_REQUEST,
  payload: { eventName: EVENT_NAME.SUBSCRIBE_TIME_FRAME_INIT_BY_COUNT, data },
});

export const socketIoGlobalConfig = (data) => ({
  type: ActionTypes.SOCKET_IO_GLOBAL_CONFIG,
  payload: { data },
});

export const changeActiveSymbolChart = (eventType: CHANGE_TYPE, data) => ({
  type: ActionTypes.CHANGE_ACTIVE_SYMBOL_CHART_LIST,
  payload: { eventType, data },
});

export const changeActiveTimeFrame = (data) => ({
  type: ActionTypes.CHANGE_ACTIVE_TIME_FRAME,
  payload: { data },
});

export const changeFavoriteSymbolList = (eventType: CHANGE_TYPE, data?) => ({
  type: ActionTypes.CHANGE_FAVORITE_SYMBOL_LIST,
  payload: { eventType, data },
});

export const openNewOrder = (order: ORDER) => ({
  type: ActionTypes.OPEN_NEW_ORDER,
  payload: order,
});

export const openOrderResult = (
  order?: ORDER | null,
  title: string | null = null,
  type: string = ALERT_TYPES.SUCCESS,
) => ({
  type: ActionTypes.OPEN_ORDER_RESULT,
  payload: { order, error: { title, type }},
});

export const closeOrder = (order?: ORDER) => ({
  type: ActionTypes.CLOSE_ORDER,
  payload: order,
});

export const closeOrderSuccess = (id?: string) => ({
  type: ActionTypes.CLOSE_ORDER_RESULT,
  payload: id,
});

export const updateOrder = (order?: ORDER) => ({
  type: ActionTypes.UPDATE_ORDER,
  payload: order,
});

export const updateOrderSuccess = (order?: ORDER) => ({
  type: ActionTypes.UPDATE_ORDER_RESULT,
  payload: order,
});

export const loadOrders = (type: ORDER_ACTION) => ({
  type: ActionTypes.LOAD_OPEN_ORDERS,
  payload: type,
});

export const loadOpenOrders = () => loadOrders(ORDER_ACTION.OPENED);
export const loadHistoryOrders = () => loadOrders(ORDER_ACTION.CLOSED);

export const loadOpenOrdersSuccess = (orders?: ORDER[]) => ({
  type: ActionTypes.LOAD_OPEN_ORDERS_SUCCESS,
  payload: orders,
});

export const loadHistoryOrdersSuccess = (orders?: ORDER[]) => ({
  type: ActionTypes.LOAD_HISTORY_ORDERS_SUCCESS,
  payload: orders,
});
