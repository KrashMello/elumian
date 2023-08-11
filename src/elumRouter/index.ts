import { type IRouter } from '@Controller/type'
import verifyToken from '@Middelware/index'
import { type NextFunction, type Request, type Response } from 'express'
import os from 'os'


const info: Array<{ api: string, handler: string, withMiddelware: boolean }> =
  []

export function router(controllers: any, app: any, Middelware: (req: Request, res: Response, next: NextFunction) => Response = verifyToken): any {

  controllers.forEach((Controller: any) => {
    const instance = new Controller()

    const prefix = Reflect.getMetadata('prefix', Controller)

    const routes: IRouter[] = Reflect.getMetadata('routes', Controller)

    routes.forEach(({ method, path, withMiddelware, handlerName, requestValidator }) => {

      if (typeof requestValidator === "undefined" && withMiddelware === false) {
        app[method](prefix.concat('', path), (req: Request, res: Response) => {
          instance[handlerName](req, res)
        })
      }
      if (typeof requestValidator !== "undefined" && withMiddelware === true) {
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
        api: `${method.toLocaleUpperCase() as string} http://${hostname}:${process.env.SERVER_PORT as string
          }${prefix.concat('', path) as string}`,
        handler: `${Controller.name as string}.${String(handlerName)}`,
        withMiddelware
      })
    })
  })
  app.use((_req: Request, res: Response) => {
    res.status(404).send(
      "<h1>Page not found on the server</h1>")
  })
  console.table(info)
}
