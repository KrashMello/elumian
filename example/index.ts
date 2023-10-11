import express from 'express'
import os from 'os'
import { router } from '@router/index'
import { controllers } from './routes'
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
const app = express()
app.use(express.json())
const whitelist = ['http://localhost:3000']
app.use(cors({
  origin: function(origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
const httpServer = createServer(app)

const io = new Server(httpServer)

router(controllers, app, io)
const hostname = os.hostname()
httpServer.listen(process.env.SERVER_PORT, () => {
  console.log(
    `server active in port: http://${hostname}:${process.env.SERVER_PORT}`
  )
})
