import { type IRouter } from '@Controller/type'
import verifyToken from '@Middelware/index'
import express, { type Request, type Response } from 'express'
import os from 'os'

const app = express()

const info: Array<{ api: string, handler: string, withMiddelware: boolean }> =
  []

export function router (controllers: any): any {
  controllers.forEach((Controller: any) => {
    const instance = new Controller()

    const prefix = Reflect.getMetadata('prefix', Controller)

    const routes: IRouter[] = Reflect.getMetadata('routes', Controller)

    routes.forEach(({ method, path, withMiddelware, handlerName }) => {
      if (!withMiddelware) {
        app[method](prefix.concat('', path), (req: Request, res: Response) => {
          instance[handlerName](req, res)
        })
      } else {
        app[method](
          prefix.concat('', path),
          verifyToken,
          (req: Request, res: Response) => {
            instance[handlerName](req, res)
          }
        )
      }
      const hostname = os.hostname()
      info.push({
        api: `${method.toLocaleUpperCase()} http://${hostname}:${
          process.env.SERVER_PORT as string
        }${prefix.concat('', path) as string}`,
        handler: `${Controller.name as string}.${String(handlerName)}`,
        withMiddelware
      })
    })
  })
  console.table(info)
}
