export const Middleware = (target) => {
  const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
  if (descriptors.init)
    Reflect.defineMetadata("middleware", descriptors.init, target)
  return target
}
const reflectorCreate = (key: string, value: any): MethodDecorator =>
  (target, _propertyKey, descriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(key, value, descriptor.value);
      return descriptor
    }
    Reflect.defineMetadata(key, value, target);
    return target
  }
export const Module = (metadata: { controllers: Array<any>, services: Array<any>, middlewares?: Array<any> }) => {
  let { controllers, services, middlewares } = metadata;
  middlewares = middlewares || [];
  return (target) => {
    Reflect.defineMetadata("controllers", controllers, target)
    Reflect.defineMetadata("middlewares", middlewares, target)
    Reflect.defineMetadata("services", services, target)
    return target
  }
}
export const Controller = (prefix: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata("prefix", prefix, target);
    Reflect.defineMetadata("handlerName", target.name, target);
    return target
  };
};
export const Service = <T extends { new(...args: any[]): {} }>(
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
export const Public = reflectorCreate('isPublic', true)
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
// export const DataEntryGuard = (data: {
//   options: validationsOptions;
//   message?: validationsMessage;
// }): MethodDecorator => {
//   return (target, propertyKey) => {
//     if (!Reflect.hasMetadata("routes", target.constructor)) {
//       Reflect.defineMetadata("routes", [], target.constructor);
//     }
//
//     const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
//     const existingRouteIndex = routes.findIndex(
//       (route) => route.handlerName === (propertyKey as string),
//     );
//     const newRoute: IRouter = {
//       method: "delete",
//       path: "/",
//       isProtected: false,
//       handlerName: propertyKey as string,
//       guard: [],
//     };
//     const guard: tGuard = (
//       req: Request,
//       res: Response,
//       next: NextFunction,
//     ): any => {
//       let validate: Record<string, string> | true;
//       let dataEntry: any;
//       if (req.method === "GET") dataEntry = req.query;
//       else dataEntry = req.body;
//       validate = compareData(dataEntry, data.options, data.message);
//       if (validate !== true)
//         return res.status(401).json({ type: "danger", message: validate });
//       next();
//     };
//
//     if (existingRouteIndex === -1) {
//       newRoute.isProtected = true;
//       newRoute.guard.push(guard);
//       routes.push(newRoute);
//     } else {
//       routes[existingRouteIndex].guard.push(guard);
//       routes[existingRouteIndex].isProtected = true;
//     }
//     Reflect.defineMetadata("routes", routes, target.constructor);
//   };
// };
// export const Guard = (Iguard: tGuard): MethodDecorator => {
//   return (target, propertyKey) => {
//     if (!Reflect.hasMetadata("routes", target.constructor)) {
//       Reflect.defineMetadata("routes", [], target.constructor);
//     }
//
//     const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
//     const existingRouteIndex = routes.findIndex(
//       (route) => route.handlerName === (propertyKey as string),
//     );
//     const newRoute: IRouter = {
//       method: "delete",
//       path: "/",
//       isProtected: false,
//       handlerName: propertyKey as string,
//       guard: [],
//     };
//     if (existingRouteIndex === -1) {
//       newRoute.isProtected = true;
//       newRoute.guard.push(Iguard);
//       routes.push(newRoute);
//     } else {
//       routes[existingRouteIndex].guard.push(Iguard);
//       routes[existingRouteIndex].isProtected = true;
//     }
//     Reflect.defineMetadata("routes", routes, target.constructor);
//   };
// };
// const verifyToken: tGuard = (req: Request, res: Response, next: NextFunction) => {
//   const id = req.header("x-access-id");
//   if (id == null)
//     return res.status(403).json({
//       error: "warning",
//       message: "No token provided!",
//     });
//   if (Elumian.cache.verifyId("Auth", id) === false)
//     return res.status(401).json({
//       error: "warning",
//       message: "Unauthorized!",
//     });
//   next();
// }
// export const ProtecteGuard = (middleware?: tGuard): MethodDecorator => {
//   return (target, propertyKey) => {
//     if (!Reflect.hasMetadata("routes", target.constructor)) {
//       Reflect.defineMetadata("routes", [], target.constructor);
//     }
//
//     const routes: IRouter[] = Reflect.getMetadata("routes", target.constructor);
//     const existingRouteIndex = routes.findIndex(
//       (route) => route.handlerName === (propertyKey as string),
//     );
//     const newRoute: IRouter = {
//       method: "delete",
//       path: "/",
//       isProtected: false,
//       handlerName: propertyKey as string,
//       guard: [],
//     };
//     if (existingRouteIndex === -1) {
//       newRoute.isProtected = true;
//       newRoute.guard.unshift(middleware || verifyToken);
//       routes.push(newRoute);
//     } else {
//       routes[existingRouteIndex].guard.unshift(
//         middleware ?? verifyToken,
//       );
//       routes[existingRouteIndex].isProtected = true;
//     }
//     Reflect.defineMetadata("routes", routes, target.constructor);
//   };
// };
