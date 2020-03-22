import { WS_URL } from '../containers/App/constants';

interface ISocketParams {
  onOpen?: () => void;
  onError?: (event: Event) => void;
  onMessage?: (data: object) => void;
}

export function initWebSocket(params: ISocketParams) {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    ws.send('ping');

    if (params.onOpen) {
      params.onOpen();
    }
  };

  ws.onerror = (event: Event) => {
    console.log('WebSocket error ' + event);
    console.dir(event);

    if (params.onError) {
      params.onError(event);
    }
  };

  ws.onmessage = (e) => {
    let msg = null;

    try {
      msg = JSON.parse(e.data);
    } catch (e) {
      console.error(`Error parsing : ${e.data}`);
    }

    if (msg && params.onMessage) {
      params.onMessage(msg);
    }
  };
}
