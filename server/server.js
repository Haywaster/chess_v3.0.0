import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 8080,
});

const games = {};

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('close', () => {
    console.log('Клиент отключился');
  });

  ws.on('message', (strData) => {
    const data = JSON.parse(strData);

    switch (data.type) {
      case 'createGame': {
        const { username, game } = data;
        const { type, id } = game;

        ws.send(JSON.stringify({ ...game, status: 'pending' }));

        if (!games[type]) {
          games[type] = {};
        }

        if (!games[type][id]) {
          games[type][id] = { id, type, gamers: {} };
        }

        if (!games[type][id].gamers) {
          games[type][id].gamers = {};
        }

        if (!games[type][id].gamers.white) {
          games[type][id].gamers.white = username;
        } else {
          games[type][id].gamers.black = username;

          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ ...game, status: 'playing' }));
            }
          });
        }

        break;
      }
    }
  });
});
