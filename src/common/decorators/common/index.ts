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
	controllers = controllers || [];
	services = services || [];
	return (target) => {
		Reflect.defineMetadata("controllers", controllers, target);
		Reflect.defineMetadata("middlewares", middlewares, target);
		Reflect.defineMetadata("services", services, target);
		return target;
	};
};
export const Controller = (prefix: string) => {
	return <T extends { new (...args: any[]): {} }>(constructor: T) => {
		Reflect.defineMetadata("prefix", prefix, constructor);
		Reflect.defineMetadata("handlerName", constructor.name, constructor);
	};
};
export const Service = () => {
	return <T extends { new (...args: any[]): {} }>(constructor: T) => {
		Reflect.defineMetadata("prefix", constructor.name, constructor);
		return class extends constructor {
			static instance;
			constructor(...args) {
				super(...args);
			}
			static getInstance() {
				if (!this.instance) {
					const dependencies =
						Reflect.getMetadata("design:paramtypes", constructor) || [];
					const instances = dependencies.map((dep) => dep.getInstance());
					this.instance = new constructor(...instances);
				}
				return this.instance;
			}
		};
	};
};
export const Public = reflectorCreate("isPublic", true);
