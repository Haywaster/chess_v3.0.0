import express from 'express';
import router from './router'
import errorMiddleware from './middlewares/errorMiddleware.ts'
import http from 'http';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import GameWebSocketService from './ws/GameWebSocketService.ts'

dotenv.config({ path: '../.env' })
const PORT = process.env.SERVER_PORT || 5000
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const server = http.createServer(app);
new GameWebSocketService(server);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
