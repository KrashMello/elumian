import { IRouter } from "./types";
import "reflect-metadata";

export const Controller = (prefix: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata("prefix", prefix, target);

    //
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
};
export const Get = (
  path: string,
  withMiddelware: boolean = true
): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey) => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    )
      routes.push({
        method: "get",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      });
    else
      routes[
        routes.findIndex((i) => i.handlerName === (propertyKey as string))
      ] = {
        method: "get",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      };
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
export const Post = (
  path: string,
  withMiddelware: boolean = true
): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey) => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    )
      routes.push({
        method: "post",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      });
    else
      routes[
        routes.findIndex((i) => i.handlerName === (propertyKey as string))
      ] = {
        method: "post",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      };

    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
export const Put = (
  path: string,
  withMiddelware: boolean = true
): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey) => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);

    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    )
      routes.push({
        method: "put",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      });
    else
      routes[
        routes.findIndex((i) => i.handlerName === (propertyKey as string))
      ] = {
        method: "put",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      };

    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
