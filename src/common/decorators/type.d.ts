import { NextFunction, Request, Response } from "express";

export type Methods = "get" | "post" | "delete" | "path" | "options" | "put";
export type MethodsSocket = "on" | "emit";
export type tGuard = (req: Request, res: Response, next: NextFunction) => any;
export interface IRouter {
  method: Methods;
  path: string;
  isProtected: boolean;
  handlerName: string;
  guard?: tGuard[];
}
export interface SRouter {
  method: MethodsSocket;
  pathName: string;
  handlerName: string;
}
export interface ControllerType {
  functionController;
}
export * from "./common/type";
