import express from 'express'
import os from 'os'
import { router } from '@router/index'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const server = (
  controllers: any[],
  whiteList: string[],
  port: string = '5000'
): void => {
  const app = express()
  app.use(express.json())
  const whitelist = whiteList
  app.use(
    cors({
      origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
    })
  )
  const httpServer = createServer(app)

  const io = new Server(httpServer)

  router(controllers, app, io)
  const hostname = os.hostname()
  httpServer.listen(port, () => {
    console.log(
      `server active in port: http://${hostname}:${port} \nserver active in port: http://localhost:${port}`
    )
  })
}

export default server
