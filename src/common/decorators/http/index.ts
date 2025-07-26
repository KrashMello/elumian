enum RequestMethod {
	GET = "get",
	POST = "post",
	PUT = "put",
	DELETE = "delete",
	PATH = "path",
}
interface IRequestMapping {
	path: string;
	method: RequestMethod;
}

const createRequestMapping = (method: RequestMethod) => (path?: string) =>
	requestMapping({ path, method });
const requestMapping = (metadata: IRequestMapping) => {
	let { path, method } = metadata;
	path = path && path.length ? path : "/";
	method = method || RequestMethod.GET;
	return (target, propertyKey, descriptor) => {
		Reflect.defineMetadata("method", method, descriptor.value);
		Reflect.defineMetadata("path", path, descriptor.value);
		Reflect.defineMetadata("handlerName", descriptor.name, descriptor.value);
		return descriptor;
	};
};
export const Get = createRequestMapping(RequestMethod.GET);
export const Post = createRequestMapping(RequestMethod.POST);
export const Put = createRequestMapping(RequestMethod.PUT);
export const Delete = createRequestMapping(RequestMethod.DELETE);
export const Path = createRequestMapping(RequestMethod.PATH);
