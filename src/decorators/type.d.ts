import { NextFunction, Request, Response } from "express";

type Methods = "get" | "post" | "delete" | "path" | "options" | "put";
type MethodsSocket = "on" | "emit";

type tGuard = (req: Request, res: Response, next: NextFunction) => any;

interface IRouter {
  method: Methods;
  path: string;
  isProtected: boolean;
  handlerName: string;
  guard?: tGuard[];
}

interface SRouter {
  method: MethodsSocket;
  pathName: string;
  handlerName: string;
}
interface ControllerType {
  functionController;
}

type functionController = Record<
  function,
  (req: Request, resp: Response) => any
>;

module.exports = {
  Methods,
  MethodsSocket,
  Guard,
  IRouter,
  SRouter,
  ControllerType,
};
