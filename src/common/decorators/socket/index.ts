import { SRouter } from "../type";

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


