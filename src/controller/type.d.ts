import { type Request, type Response } from 'express'

export type Methods = 'get' | 'post' | 'delete' | 'path' | 'options' | 'put'
export type MethodsSocket = 'on' | 'emit'

export interface IRouter {
  method: Methods
  path: string
  withMiddelware: boolean
  handlerName: string
  requestValidator?: (req: Request, res: Response, next: NextFunction) => any
}

export interface SRouter {
  method: MethodsSocket
  pathName: string
  handlerName: string
}
export interface ControllerType {
  functionController
}

type functionController = Record<
  function,
  (req: Request, resp: Response) => any
>
