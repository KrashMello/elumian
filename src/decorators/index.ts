import { type SRouter, type IRouter } from "../type";
import "reflect-metadata";

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
      target.constructor
    );
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string)
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
      target.constructor
    );
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string)
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
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string)
    );

    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    ) {
      routes.push({
        method: "get",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      });
    } else {
      routes[index] = {
        ...routes[index],
        method: "get",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      };
    }
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
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string)
    );

    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    ) {
      routes.push({
        method: "post",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      });
    } else {
      routes[index] = {
        ...routes[index],
        method: "post",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      };
    }
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
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string)
    );

    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    ) {
      routes.push({
        method: "put",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      });
    } else {
      routes[index] = {
        ...routes[index],
        method: "put",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      };
    }

    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const Path = (
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
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string)
    );

    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    ) {
      routes.push({
        method: "path",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      });
    } else {
      routes[index] = {
        ...routes[index],
        method: "path",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      };
    }

    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const Delete = (
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
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string)
    );

    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    ) {
      routes.push({
        method: "delete",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      });
    } else {
      routes[index] = {
        ...routes[index],
        method: "delete",
        path,
        withMiddelware,
        handlerName: propertyKey as string,
      };
    }

    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const RequestValidator = (requestValidator: any): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey) => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
    const index = routes.findIndex(
      (i) => i.handlerName === (propertyKey as string)
    );
    if (
      routes.filter((r) => r.handlerName === (propertyKey as string)).length ===
      0
    ) {
      routes.push({
        method: "get",
        path: "",
        withMiddelware: true,
        handlerName: propertyKey as string,
        requestValidator,
      });
    } else {
      routes[index] = {
        method: "get",
        path: "",
        withMiddelware: true,
        handlerName: propertyKey as string,
      };
    }

    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const Services = (prefix: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata("prefix", prefix, target);
  };
};
