"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidator = exports.Delete = exports.Path = exports.Put = exports.Post = exports.Get = exports.socketEmit = exports.socketOn = exports.Controller = void 0;
require("reflect-metadata");
const Controller = (prefix) => {
    return (target) => {
        Reflect.defineMetadata('prefix', prefix, target);
    };
};
exports.Controller = Controller;
const socketOn = (pathName) => {
    return (target, propertyKey) => {
        if (!Reflect.hasMetadata('routesSocket', target.constructor)) {
            Reflect.defineMetadata('routesSocket', [], target.constructor);
        }
        const routes = Reflect.getMetadata('routesSocket', target.constructor);
        const index = routes.findIndex((i) => i.handlerName === propertyKey);
        if (routes.filter((r) => r.handlerName === propertyKey).length ===
            0)
            routes.push({
                method: 'on',
                pathName,
                handlerName: propertyKey,
            });
        else
            routes[index] = {
                method: 'on',
                pathName,
                handlerName: propertyKey,
            };
    };
};
exports.socketOn = socketOn;
const socketEmit = (pathName) => {
    return (target, propertyKey) => {
        if (!Reflect.hasMetadata('routesSocket', target.constructor)) {
            Reflect.defineMetadata('routesSocket', [], target.constructor);
        }
        const routes = Reflect.getMetadata('routesSocket', target.constructor);
        const index = routes.findIndex((i) => i.handlerName === propertyKey);
        if (routes.filter((r) => r.handlerName === propertyKey).length ===
            0)
            routes.push({
                method: 'emit',
                pathName,
                handlerName: propertyKey,
            });
        else
            routes[index] = {
                method: 'emit',
                pathName,
                handlerName: propertyKey,
            };
    };
};
exports.socketEmit = socketEmit;
const Get = (path, withMiddelware = true) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey) => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor);
        const index = routes.findIndex((i) => i.handlerName === propertyKey);
        if (routes.filter((r) => r.handlerName === propertyKey).length ===
            0) {
            routes.push({
                method: 'get',
                path,
                withMiddelware,
                handlerName: propertyKey,
            });
        }
        else {
            routes[index] = {
                ...routes[index],
                method: 'get',
                path,
                withMiddelware,
                handlerName: propertyKey,
            };
        }
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
exports.Get = Get;
const Post = (path, withMiddelware = true) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey) => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor);
        const index = routes.findIndex((i) => i.handlerName === propertyKey);
        if (routes.filter((r) => r.handlerName === propertyKey).length ===
            0) {
            routes.push({
                method: 'post',
                path,
                withMiddelware,
                handlerName: propertyKey,
            });
        }
        else {
            routes[index] = {
                ...routes[index],
                method: 'post',
                path,
                withMiddelware,
                handlerName: propertyKey,
            };
        }
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
exports.Post = Post;
const Put = (path, withMiddelware = true) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey) => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor);
        const index = routes.findIndex((i) => i.handlerName === propertyKey);
        if (routes.filter((r) => r.handlerName === propertyKey).length ===
            0) {
            routes.push({
                method: 'put',
                path,
                withMiddelware,
                handlerName: propertyKey,
            });
        }
        else {
            routes[index] = {
                ...routes[index],
                method: 'put',
                path,
                withMiddelware,
                handlerName: propertyKey,
            };
        }
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
exports.Put = Put;
const Path = (path, withMiddelware = true) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey) => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor);
        const index = routes.findIndex((i) => i.handlerName === propertyKey);
        if (routes.filter((r) => r.handlerName === propertyKey).length ===
            0) {
            routes.push({
                method: 'path',
                path,
                withMiddelware,
                handlerName: propertyKey,
            });
        }
        else {
            routes[index] = {
                ...routes[index],
                method: 'path',
                path,
                withMiddelware,
                handlerName: propertyKey,
            };
        }
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
exports.Path = Path;
const Delete = (path, withMiddelware = true) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey) => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor);
        const index = routes.findIndex((i) => i.handlerName === propertyKey);
        if (routes.filter((r) => r.handlerName === propertyKey).length ===
            0) {
            routes.push({
                method: 'delete',
                path,
                withMiddelware,
                handlerName: propertyKey,
            });
        }
        else {
            routes[index] = {
                ...routes[index],
                method: 'delete',
                path,
                withMiddelware,
                handlerName: propertyKey,
            };
        }
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
exports.Delete = Delete;
const RequestValidator = (requestValidator) => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey) => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor);
        const index = routes.findIndex((i) => i.handlerName === propertyKey);
        if (routes.filter((r) => r.handlerName === propertyKey).length ===
            0) {
            routes.push({
                method: 'get',
                path: '',
                withMiddelware: true,
                handlerName: propertyKey,
                requestValidator,
            });
        }
        else {
            routes[index] = {
                method: 'get',
                path: '',
                withMiddelware: true,
                handlerName: propertyKey,
            };
        }
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};
exports.RequestValidator = RequestValidator;
