import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 8080,
});

wss.on('connection', (ws) => {
  console.log('Новый клиент подключился!');
  ws.send('Hello, client!');

  ws.on('error', console.error);

  ws.on('close', () => {
    console.log('Клиент отключился');
  });

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
