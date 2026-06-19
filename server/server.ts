/* eslint-disable no-console */

import http from 'http'

import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'

import errorMiddleware from './middlewares/errorMiddleware'
import router from './router'
import GameWebSocketService from './ws/GameWebSocketService'

dotenv.config({ path: '../.env' })
const DEFAULT_SERVER_PORT = 5000
const PORT = process.env.SERVER_PORT || DEFAULT_SERVER_PORT
const app = express()

app
  .use(express.json())
  .use(cookieParser())
  .use('/api', router)
  .use(errorMiddleware)

const server = http.createServer(app)
new GameWebSocketService(server)

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
