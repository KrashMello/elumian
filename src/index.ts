import express, { Request, Response } from 'express'
import os from 'os'
import { controllers } from './routes/index'
import { IRouter } from '@Controller/type'
import 'dotenv/config'
import verifyToken from '@Middelware/index'

const app = express()
app.use(express.json())

const info: Array<{ api: string; handler: string; withMiddelware: boolean }> =
  []

controllers.forEach((controller) => {
  const instance = new controller()

  const prefix = Reflect.getMetadata('prefix', controller)

  const routes: IRouter[] = Reflect.getMetadata('routes', controller)

  routes.forEach(({ method, path, withMiddelware, handlerName }) => {
    if (!withMiddelware)
      app[method](prefix + path, (req: Request, res: Response) => {
        ;(instance as any)[handlerName](req, res)
      })
    else
      app[method](prefix + path, verifyToken, (req: Request, res: Response) => {
        ;(instance as any)[handlerName](req, res)
      })

    info.push({
      api: `${method.toLocaleUpperCase()} http://${
        os.networkInterfaces()['enp2s0']![0]?.address as string
      }:${process.env.SERVER_PORT}${prefix + path}`,
      handler: `${controller.name}.${String(handlerName)}`,
      withMiddelware,
    })
  })
})

console.table(info)
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `server active in port: http://${
      os.networkInterfaces()['enp2s0']![0]?.address as string
    }:${process.env.SERVER_PORT}`
  )
})
