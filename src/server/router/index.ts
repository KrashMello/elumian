import type { SRouter, IRouter } from "elumian/core/decorators";
import type { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { getIPV4 } from "../server";
export interface RouteInfo {
  api: string;
  handler: string;
  protected: boolean;
}

export interface SocketRoute {
  method: string;
  path: string;
  functionSocket: (io: any, socket: any) => void;
}

export type SocketInfo = { method: string; path: string; handlerName: string };
const IPV4 = getIPV4();
const DEFAULT_PORT = process.env.PORT ?? 5000;

const routeInfo: RouteInfo[] = [];
const socketInfo: SocketInfo[] = [];
const socketRoutes: SocketRoute[] = [];

export function router(controllers: any[], app: any, io: any): void {
  controllers.forEach((Controller: any) => {
    const instance = new Controller();
    const prefix = Reflect.getMetadata("prefix", Controller);
    const routes: IRouter[] = Reflect.getMetadata("routes", Controller) || [];
    const routesSocket: SRouter[] =
      Reflect.getMetadata("routesSocket", Controller) || [];

    registerHttpRoutes(routes, prefix, instance, app, Controller.name);
    registerSocketRoutes(routesSocket, prefix, instance, Controller.name);
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Ruta no encontrada!" });
  });

  io.on("connection", (socket: any) => {
    console.log(`ID conectado: ${socket.id}`);
    socketRoutes.forEach(({ method, path, functionSocket }) => {
      console.log(method, path);
      functionSocket(io, socket);
    });
  });

  console.table(routeInfo);
  if (socketInfo.length > 0) console.table(socketInfo);
}

function registerHttpRoutes(
  routes: IRouter[],
  prefix: string,
  instance: any,
  app: any,
  controllerName: string,
) {
  routes.forEach(({ method, path, isProtected, handlerName, guard }) => {
    const routePath = `${prefix}${path}`;
    let middlewares = [];

    if (guard) {
      middlewares = [...guard];
    }

    app[method](routePath, ...middlewares, instance[handlerName]);

    routeInfo.push({
      api: `${method.toUpperCase()} http://${IPV4}:${process.env.SERVER_PORT ?? DEFAULT_PORT}${routePath}`,
      handler: `${controllerName}@${handlerName}`,
      protected: isProtected,
    });
  });
}

function registerSocketRoutes(
  routesSocket: SRouter[],
  prefix: string,
  instance: any,
  controllerName: string,
) {
  routesSocket.forEach(({ method, pathName, handlerName }) => {
    const socketPath = `${prefix}:${pathName}`;
    socketRoutes.push({
      method,
      path: socketPath,
      functionSocket: (io: any, socket: any) => {
        instance[handlerName](io, socket);
      },
    });
    socketInfo.push({
      method,
      path: socketPath,
      handlerName: `${controllerName}.${handlerName}`,
    });
  });
}
