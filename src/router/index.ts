import type { SRouter, IRouter } from '../type'
import verifyToken from '@elumian/middelware'
import type { NextFunction, Request, Response } from 'express'
import os from 'os'
import 'reflect-metadata'

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

const info: Array<{ api: string; handler: string; withMiddelware: boolean }> =
  []
const infoSocket: Array<{ method: string; path: string; handlerName: string }> =
  []

const socketRouter: Array<{
  method: string
  path: string
  functionSocket: any
}> = []

export function router(
  controllers: any,
  app: any,
  io: any,
  Middelware: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Response = verifyToken
): any {
  controllers.forEach((Controller: any) => {
    const instance = new Controller()

    const prefix = Reflect.getMetadata('prefix', Controller)

    const routes: IRouter[] = Reflect.getMetadata('routes', Controller)
    const routesSocket: SRouter[] = Reflect.getMetadata(
      'routesSocket',
      Controller
    )

    routes.forEach(
      ({ method, path, withMiddelware, handlerName, requestValidator }) => {
        if (typeof requestValidator === 'undefined' && !withMiddelware) {
          app[method](
            prefix.concat('', path),
            (req: Request, res: Response) => {
              instance[handlerName](req, res)
            }
          )
        }
        if (typeof requestValidator !== 'undefined' && withMiddelware) {
          app[method](
            prefix.concat('', path),
            Middelware,
            requestValidator,
            (req: Request, res: Response) => {
              instance[handlerName](req, res)
            }
          )
        } else if (typeof requestValidator !== 'undefined') {
          app[method](
            prefix.concat('', path),
            requestValidator,
            (req: Request, res: Response) => {
              instance[handlerName](req, res)
            }
          )
        } else {
          app[method](
            prefix.concat('', path),
            Middelware,
            (req: Request, res: Response) => {
              instance[handlerName](req, res)
            }
          )
        }
        info.push({
          api: `${method.toLocaleUpperCase()} http://${IPV4}:${
            process.env.SERVER_PORT ?? 5000
          }${prefix.concat('', path) as string}`,
          handler: `${Controller.name as string}.${String(handlerName)}`,
          withMiddelware,
        })
      }
    )

    if (routesSocket != null)
      routesSocket.forEach(({ method, pathName, handlerName }) => {
        socketRouter.push({
          method,
          path: prefix.concat(':', pathName),
          functionSocket: (io: any, socket: any) => {
            instance[handlerName](io, socket)
          },
        })
        infoSocket.push({
          method,
          path: prefix.concat(':', pathName),
          handlerName: `${Controller.name as string}.${String(handlerName)}`,
        })
      })
  })
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'ruta no encontrada!' })
  })
  io.on('connection', (socket: any) => {
    console.log(`id is connect: ${socket.id as string}`)
    socketRouter.forEach(({ method, path, functionSocket }) => {
      console.log(method, path)
      functionSocket(io, socket)
    })
  })
  console.table(info)
  if (infoSocket.length > 0) console.table(infoSocket)
}
