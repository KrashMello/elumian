import express from 'express'
import os from 'os'
import { router } from '@router/index'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const server = (
  controllers: any[],
  whiteList: string[] | undefined = undefined,
  port: number = 5000
): void => {
  const app = express()
  app.use(express.json())
  if (
    whiteList !== undefined &&
    whiteList.length > 0 &&
    Array.isArray(whiteList)
  )
    app.use(
      cors({
        origin: function (origin: string | undefined, callback) {
          console.log(origin)
          if (
            typeof origin === 'string' &&
            whiteList.includes(origin) &&
            origin !== undefined
          ) {
            callback(null, true)
          } else {
            callback(new Error('Not allowed by CORS'))
          }
        },
      })
    )
  const { networkInterfaces } = os
  const nets = networkInterfaces()
  const results = Object.create(null) // Or just '{}', an empty object
  let IPV4 = ''

  for (const name of Object.keys(nets)) {
    const auxNets = nets[name]
    if (auxNets != null)
      for (const net of auxNets) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
          const auxResult = results[name]
          if (auxResult == null) {
            results[name] = []
          }
          IPV4 = net.address
          results[name].push(net.address)
        }
      }
  }

  const httpServer = createServer(app)

  const io = new Server(httpServer)

  router(controllers, app, io)

  httpServer.listen(port, () => {
    console.log(
      `server active: http://${IPV4}:${port} \nserver active: http://localhost:${port}`
    )
  })
}

export default server
