import socketIOClient from 'socket.io-client';

export const socketConnect = (url: string, params?: {}) => {
  const socket = socketIOClient(url, params);
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
      console.log('Socket connected');
    });
  });
};
