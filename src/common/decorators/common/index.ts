import { moduleMetadata } from "./type";
export const Middleware = (target) => {
	const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
	if (descriptors.init)
		Reflect.defineMetadata("middleware", descriptors.init, target);
	return target;
};
const reflectorCreate =
	(key: string, value: any): MethodDecorator =>
	(target, _propertyKey, descriptor) => {
		if (descriptor) {
			Reflect.defineMetadata(key, value, descriptor.value);
			return descriptor;
		}
		Reflect.defineMetadata(key, value, target);
		return target;
	};
export const Module = (metadata: moduleMetadata) => {
	let { controllers, services, middlewares } = metadata;
	middlewares = middlewares || [];
	return (target) => {
		Reflect.defineMetadata("controllers", controllers, target);
		Reflect.defineMetadata("middlewares", middlewares, target);
		Reflect.defineMetadata("services", services, target);
		return target;
	};
};
export const Controller = (prefix: string): ClassDecorator => {
	return (target) => {
		Reflect.defineMetadata("prefix", prefix, target);
		Reflect.defineMetadata("handlerName", target.name, target);
		return target;
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
export const Public = reflectorCreate("isPublic", true);
