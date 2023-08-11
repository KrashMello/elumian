import { type Request, type Response } from 'express'

export type Methods = 'get' | 'post' | 'delete' | 'options' | 'put'
export interface IRouter {
  method: Methods
  path: string
  withMiddelware: boolean
  handlerName: string
  requestValidator?: (req: Request, res: Response, next: NextFunction) => any
}

export interface ControllerType {
  functionController
}

type functionController = Record<
  function,
  (req: Request, resp: Response) => any
>
