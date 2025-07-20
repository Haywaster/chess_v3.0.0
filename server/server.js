import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 8080,
});

const users = {}
const games = {};

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('close', () => {
    console.log('Клиент отключился');
  });

  ws.on('message', (strData) => {
    // Объект { type, data }
    const parsedData = JSON.parse(strData);

    switch (parsedData.type) {
      case 'logout': {
        const { data: { username } } = parsedData;

        users[username] = {
          username,
          online: false,
        };

        ws.send(JSON.stringify({ type: parsedData.type, data: users[username] }));
        break;
      }
      case 'auth': {
        const { data: { username } } = parsedData;

        users[username] = {
          username,
          online: true,
        };

        ws.send(JSON.stringify({ type: parsedData.type, data: users[username] }));
        break;
      }
      case 'createGame': {
        const { username, game } = parsedData;
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
