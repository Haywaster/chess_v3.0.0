import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import router from './router'
import errorMiddleware from './middlewares/error-middleware'
import http from 'http';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config({ path: '../.env' })
const PORT = process.env.SERVER_PORT || 5000
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}))
app.use('/api', router)
app.use(errorMiddleware)

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
//
// // WS логика
// const users = {}
// const games = {};
//
// wss.on('connection', (ws) => {
//   ws.on('error', console.error);
//
//   ws.on('close', () => {
//     console.log('Клиент отключился');
//   });
//
//   ws.on('message', (strData) => {
//     // Объект { type, data }
//     const { type, data } = JSON.parse(strData);
//
//     switch (type) {
//       case 'logout': {
//         const { username } = data;
//
//         users[username] = {
//           username,
//           online: false,
//         };
//
//         ws.send(JSON.stringify({ type, data: users[username] }));
//         break;
//       }
//       case 'auth': {
//         const { username } = data;
//
//         users[username] = {
//           username,
//           online: true,
//         };
//
//         ws.send(JSON.stringify({ type, data: users[username] }));
//         break;
//       }
//       case 'createGame': {
//         const { username, game } = data;
//         const { type: gameType, id } = game;
//         console.log(game);
//
//         ws.send(JSON.stringify({ type, data: { ...game, status: 'playing' } }));
//
// //        if (!games[type]) {
// //          games[type] = {};
// //        }
// //
// //        if (!games[type][id]) {
// //          games[type][id] = { id, type, gamers: {} };
// //        }
// //
// //        if (!games[type][id].gamers) {
// //          games[type][id].gamers = {};
// //        }
// //
// //        if (!games[type][id].gamers.white) {
// //          games[type][id].gamers.white = username;
// //        } else {
// //          games[type][id].gamers.black = username;
// //
// //          wss.clients.forEach((client) => {
// //            if (client !== ws && client.readyState === WebSocket.OPEN) {
// //              client.send(JSON.stringify({ ...game, status: 'playing' }));
// //            }
// //          });
// //        }
//
//         break;
//       }
//     }
//   });
// });

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
