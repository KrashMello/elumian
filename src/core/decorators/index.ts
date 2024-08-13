import { type SRouter, type IRouter, type tGuard } from "./type";
import {
  validationsOptions,
  validationsMessage,
} from "@elumian/server/request/type";
import { type Response, type Request, type NextFunction } from "express";
import { compareData } from "@elumian/server/request";
import "reflect-metadata";
import { Elumian } from "..";

export const Controller = (prefix: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata("prefix", prefix, target);
  };
};

export const socketOn = (pathName: string): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routesSocket", target.constructor)) {
      Reflect.defineMetadata("routesSocket", [], target.constructor);
    }
    const routes: SRouter[] = Reflect.getMetadata(
      "routesSocket",
      target.constructor,
    );
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string),
    );

    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    )
      routes.push({
        method: "on",
        pathName,
        handlerName: propertyKey as string,
      });
    else
      routes[index] = {
        method: "on",
        pathName,
        handlerName: propertyKey as string,
      };
  };
};

export const socketEmit = (pathName: string): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routesSocket", target.constructor)) {
      Reflect.defineMetadata("routesSocket", [], target.constructor);
    }
    const routes: SRouter[] = Reflect.getMetadata(
      "routesSocket",
      target.constructor,
    );
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string),
    );

    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    )
      routes.push({
        method: "emit",
        pathName,
        handlerName: propertyKey as string,
      });
    else
      routes[index] = {
        method: "emit",
        pathName,
        handlerName: propertyKey as string,
      };
  };
};

export const Get = (path: string): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const existingRouteIndex = routes.findIndex(
      (route) => route.handlerName === (propertyKey as string),
    );
    const newRoute: IRouter = {
      method: "get",
      path,
      isProtected: false,
      handlerName: propertyKey as string,
    };
    if (existingRouteIndex === -1) {
      routes.push(newRoute);
    } else {
      routes[existingRouteIndex].path = path;
      routes[existingRouteIndex].method = "get";
    }
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
export const Post = (path: string): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const existingRouteIndex = routes.findIndex(
      (route) => route.handlerName === (propertyKey as string),
    );
    const newRoute: IRouter = {
      method: "post",
      path,
      isProtected: false,
      handlerName: propertyKey as string,
    };
    if (existingRouteIndex === -1) {
      routes.push(newRoute);
    } else {
      routes[existingRouteIndex].path = path;
      routes[existingRouteIndex].method = "post";
    }
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
export const Put = (path: string): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const existingRouteIndex = routes.findIndex(
      (route) => route.handlerName === (propertyKey as string),
    );
    const newRoute: IRouter = {
      method: "put",
      path,
      isProtected: false,
      handlerName: propertyKey as string,
    };
    if (existingRouteIndex === -1) {
      routes.push(newRoute);
    } else {
      routes[existingRouteIndex].path = path;
      routes[existingRouteIndex].method = "put";
    }
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const Path = (path: string): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const existingRouteIndex = routes.findIndex(
      (route) => route.handlerName === (propertyKey as string),
    );
    const newRoute: IRouter = {
      method: "path",
      path,
      isProtected: false,
      handlerName: propertyKey as string,
    };
    if (existingRouteIndex === -1) {
      routes.push(newRoute);
    } else {
      routes[existingRouteIndex].path = path;
      routes[existingRouteIndex].method = "path";
    }
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const Delete = (path: string): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const existingRouteIndex = routes.findIndex(
      (route) => route.handlerName === (propertyKey as string),
    );
    const newRoute: IRouter = {
      method: "delete",
      path,
      isProtected: false,
      handlerName: propertyKey as string,
    };
    if (existingRouteIndex === -1) {
      routes.push(newRoute);
    } else {
      routes[existingRouteIndex].path = path;
      routes[existingRouteIndex].method = "delete";
    }
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
export const Guard = (Iguard: tGuard): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const existingRouteIndex = routes.findIndex(
      (route) => route.handlerName === (propertyKey as string),
    );
    const newRoute: IRouter = {
      method: "delete",
      path: "/",
      isProtected: false,
      handlerName: propertyKey as string,
      guard: [],
    };
    if (existingRouteIndex === -1) {
      newRoute.isProtected = true;
      newRoute.guard.push(Iguard);
      routes.push(newRoute);
    } else {
      routes[existingRouteIndex].guard.push(Iguard);
      routes[existingRouteIndex].isProtected = true;
    }
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

function verifyToken(req: Request, res: Response, next: NextFunction): any {
  const id = req.header("x-access-id");

  if (id == null) {
    return res.status(403).send({
      error: "warning",
      message: "No token provided!",
    });
  }
  if (Elumian.cache.verifyId("Auth", id) === false)
    return res.status(401).json({
      error: "warning",
      message: "Unauthorized!",
    });
  next();
}
export const ProtecteGuard = (middleware?: tGuard): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const existingRouteIndex = routes.findIndex(
      (route) => route.handlerName === (propertyKey as string),
    );
    const newRoute: IRouter = {
      method: "delete",
      path: "/",
      isProtected: false,
      handlerName: propertyKey as string,
      guard: [],
    };
    if (existingRouteIndex === -1) {
      newRoute.isProtected = true;
      newRoute.guard.unshift(middleware ? middleware : verifyToken);
      routes.push(newRoute);
    } else {
      routes[existingRouteIndex].guard.unshift(
        middleware ? middleware : verifyToken,
      );
      routes[existingRouteIndex].isProtected = true;
    }
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const DataEntryGuard = (data: {
  options: validationsOptions;
  message?: validationsMessage;
}): MethodDecorator => {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const existingRouteIndex = routes.findIndex(
      (route) => route.handlerName === (propertyKey as string),
    );
    const newRoute: IRouter = {
      method: "delete",
      path: "/",
      isProtected: false,
      handlerName: propertyKey as string,
      guard: [],
    };
    const guard: tGuard = (
      req: Request,
      res: Response,
      next: NextFunction,
    ): any => {
      let validate: Record<string, string> | true;
      let dataEntry: any;
      if (req.method === "GET") dataEntry = req.query;
      else dataEntry = req.body;
      validate = compareData(dataEntry, data.options, data.message);
      if (validate !== true)
        return res.status(401).json({ type: "danger", message: validate });
      next();
    };

    if (existingRouteIndex === -1) {
      newRoute.isProtected = true;
      newRoute.guard.push(guard);
      routes.push(newRoute);
    } else {
      routes[existingRouteIndex].guard.push(guard);
      routes[existingRouteIndex].isProtected = true;
    }
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const Service = <T extends { new (...args: any[]): {} }>(
  constructor: T,
) => {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      if (!Reflect.getMetadata("service", constructor)) {
        Reflect.defineMetadata("prefix", constructor.name, constructor);
        Reflect.defineMetadata("service", this, constructor);
      }
      return Reflect.getMetadata("service", constructor);
    }
  };
};

export const CatchErrors = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.error(
        `Error en ${target.constructor.name}@${propertyKey}:`,
        error,
      );
      const [_req, res] = args;
      res.status(401).json({
        type: "warning",
        message: "internal server error",
      });
    }
  };

  return descriptor;
};
