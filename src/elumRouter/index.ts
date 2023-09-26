import { type SRouter, type IRouter } from '@Controller/type'
import verifyToken from '@Middelware/index'
import { type NextFunction, type Request, type Response } from 'express'
import os from 'os'


const info: Array<{ api: string, handler: string, withMiddelware: boolean }> =
  []
const infoSocket: Array<{ method: string, path: string, handlerName: string }> = []

const socketRouter: Array<{ method: string, path: string, functionSocket: any }> = []

export function router(controllers: any, app: any, io: any, Middelware: (req: Request, res: Response, next: NextFunction) => Response = verifyToken): any {

  controllers.forEach((Controller: any) => {
    const instance = new Controller()

    const prefix = Reflect.getMetadata('prefix', Controller)

    const routes: IRouter[] = Reflect.getMetadata('routes', Controller)
    const routesSocket: SRouter[] = Reflect.getMetadata('routesSocket', Controller)

    routes.forEach(({ method, path, withMiddelware, handlerName, requestValidator }) => {

      if (typeof requestValidator === "undefined" && !withMiddelware) {
        app[method](prefix.concat('', path), (req: Request, res: Response) => {
          instance[handlerName](req, res)
        })
      }
      if (typeof requestValidator !== "undefined" && withMiddelware) {
        app[method](
          prefix.concat('', path),
          Middelware,
          requestValidator,
          (req: Request, res: Response) => {
            instance[handlerName](req, res)
          }
        )
      }
      else if (typeof requestValidator !== "undefined") {
        app[method](
          prefix.concat('', path),
          requestValidator,
          (req: Request, res: Response) => {
            instance[handlerName](req, res)
          }
        )
      }
      else {
        app[method](
          prefix.concat('', path),
          Middelware,
          (req: Request, res: Response) => {
            instance[handlerName](req, res)
          }
        )
      }
      const hostname = os.hostname()
      info.push({
        api: `${method.toLocaleUpperCase()} http://${hostname}:${process.env.SERVER_PORT
          }${prefix.concat('', path) as string}`,
        handler: `${Controller.name as string}.${String(handlerName)}`,
        withMiddelware
      })
    })

    if (routesSocket != null)
      routesSocket.forEach(({ method, pathName, handlerName }) => {
        socketRouter.push({ method, path: prefix.concat(':', pathName), functionSocket: (io: any, socket: any) => { instance[handlerName](io, socket) } })
        infoSocket.push({ method, path: prefix.concat(':', pathName), handlerName: `${Controller.name as string}.${String(handlerName)}` })
      })

  })
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "ruta no encontrada!" })
  })
  io.on("connection", (socket: any) => {
    console.log(`id is connect: ${socket.id as string}`)
    socketRouter.forEach(({ method, path, functionSocket }) => {
      console.log(method, path)
      functionSocket(io, socket)

    })
  })
  console.table(info)
  if (infoSocket.length > 0) console.table(infoSocket)
}
