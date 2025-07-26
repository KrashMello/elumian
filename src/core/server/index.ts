import * as express from "express";
import type { Express } from "express";
import * as os from "os";
import * as http from "http";
// import { Server as ServerIO, Socket } from "socket.io";
import * as cors from "cors";
import { type CorsOptions } from "cors";
import { Elumian } from "../elumian";
import { ServerConfig } from "./type";
import type { SRouter, IRouter, moduleMetadata } from "elumian/common/type";
import { RouteInfo, type SocketInfo, SocketRoute } from "./type";
import type { NextFunction, Request, Response } from "express";
import { setMessages, validations } from "elumian/common";
import { HttpExceptions } from "elumian/common";

const socketInfo: SocketInfo[] = [];
const socketRoutes: SocketRoute[] = [];

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
			functionSocket: (io: Server, socket: any) => {
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

function getIPV4(): string {
	const { networkInterfaces } = os;
	const nets = networkInterfaces();
	let IPV4: string = "127.0.0.1";

	for (const name of Object.keys(nets)) {
		const auxNets: (os.NetworkInterfaceInfo | null)[] | undefined = nets[name];
		if (auxNets) {
			for (const net of auxNets) {
				const familyV4Value: string | number =
					typeof net.family === "string" ? "IPv4" : 4;
				if (
					net.family === familyV4Value &&
					!net.internal &&
					typeof net.address === "string"
				) {
					IPV4 = net.address;
					break;
				}
			}
		}
	}

	return IPV4;
}

export class Server {
	private static app: Express = express();
	private static config: ServerConfig;
	private static routesInfo: RouteInfo[] = [];
	static setConfig = (config: ServerConfig) => {
		this.app.use(express.json());
		this.config = config;
	};
	static chargeModules = (modules: any[]) => {
		for (let modul of modules) {
			const controllers = Reflect.getMetadata("controllers", modul);
			const middlewares = Reflect.getMetadata("middlewares", modul);
			const services = Reflect.getMetadata("services", modul);
			//NOTE: aqui empiezo a cargar los servicios de los modulos
			if (services && services.length > 0)
				for (let service of services) {
					const initialService = new service();
					const prefix = Reflect.getMetadata("prefix", service);
					if (!Elumian[prefix]) Elumian[prefix] = initialService;
				}
			//NOTE: aqui empiezo a cargar los controladores de los modulos
			for (let controller of controllers) {
				const prefix = Reflect.getMetadata("prefix", controller);
				const controllerHandlerName = Reflect.getMetadata(
					"handlerName",
					controller,
				);
				controller = controller.prototype;
				const descriptors = Object.getOwnPropertyDescriptors(controller);
				let routes = express.Router();
				//NOTE: en esta fase empieza a leer todas las funciones incluido el constructor
				//
				for (const propertyKey in descriptors) {
					let guards = [];
					const descriptor = descriptors[propertyKey];
					//NOTE: chequeo que no sea el constructor
					if (
						propertyKey !== "constructor" &&
						typeof descriptor.value == "function"
					) {
						this.routesInfo.push({
							controller: controllerHandlerName + "@" + propertyKey,
							method: (
								Reflect.getMetadata("method", descriptor.value) || "get"
							).toUpperCase(),
							path:
								`http://localhost:${this.config.port}/${prefix}${Reflect.getMetadata("path", descriptor.value)}` ||
								`http://localhost:${this.config.port}/${prefix}/`,
						});
						const method =
							Reflect.getMetadata("method", descriptor.value) || "get";
						const path = Reflect.getMetadata("path", descriptor.value) || "/";
						const dataValidations = {
							body: Reflect.getMetadata(
								"dataValitationsBody",
								descriptor.value,
							),
							query: Reflect.getMetadata(
								"dataValitationsQuery",
								descriptor.value,
							),
							params: Reflect.getMetadata(
								"dataValitationsParams",
								descriptor.value,
							),
						};
						const dataValidate = (req, type) => {
							return validations.compareData(req[type], dataValidations[type]);
						};
						const messages = Reflect.getMetadata(
							"ValidationsMessage",
							descriptor.value,
						);
						//NOTE: aqui lo que hago es almacenar los guards existentes
						if (middlewares && middlewares.length > 0)
							for (let middleware of middlewares) {
								let init = Reflect.getMetadata("middleware", middleware);
								init = Object.getOwnPropertyDescriptors(init).value.value;
								guards.push((req, res, next) => {
									try {
										if (init(descriptor.value)) next();
									} catch (e) {
										if (e.data) res.status(e.status).json(e.data);
										else {
											console.log(e);
											res.status(500).json({
												message: "Internal server error",
												type: "DANGER",
											});
										}
									}
								});
							}
						//NOTE:: aqui cargamos en el router las funciones de los controladores
						routes[method](path, ...guards, async (req, res, next) => {
							try {
								if (messages) setMessages(messages);
								const validateResponse: {
									params?: any;
									query?: any;
									body?: any;
								} = {};
								if (
									dataValidations.params &&
									dataValidate(req, "params") !== true
								)
									validateResponse["params"] = dataValidate(req, "params");
								if (
									dataValidations.query &&
									dataValidate(req, "query") !== true
								)
									validateResponse["query"] = dataValidate(req, "query");
								if (
									dataValidations.body &&
									method !== "get" &&
									dataValidate(req, "body") !== true
								)
									validateResponse["body"] = dataValidate(req, "body");
								if (
									validateResponse.body ||
									validateResponse.query ||
									validateResponse.params
								) {
									HttpExceptions({
										message: validateResponse,
										type: "WARNING",
										status: 401,
									});
								}
								await descriptor.value(req, res, next);
							} catch (e) {
								if (e.data) res.status(e.status).json(e.data);
								else {
									console.log(e);
									res
										.status(500)
										.json({ message: "Internal server error", type: "DANGER" });
								}
							}
						});
					}
				}
				this.app.use(`/${prefix}`, routes);
			}
		}
	};
	static configCors = (args: { whiteList: string[] | string }) => {
		const { whiteList } = args;
		const corsOptions: CorsOptions =
			typeof whiteList === "object"
				? {
						origin: (origin, callback) => {
							if (!origin || (whiteList && whiteList.includes(origin))) {
								callback(null, true);
							} else {
								callback(new Error("Not allowed by CORS"));
							}
						},
					}
				: {
						origin: whiteList,
					};
		this.app.use(cors(corsOptions));
	};
	static start = (): void => {
		if (Object.keys(this.config).length === 0) {
			console.log("the config need been set");
			return;
		}
		this.config.port = this.config.port ?? 5000;
		const httpServer: http.Server = http.createServer(this.app);
		// const io: Server = new Server(httpServer);
		this.app.use((_req: Request, res: Response) => {
			res.status(404).json({ message: "Ruta no encontrada!" });
		});
		console.table(this.routesInfo);
		httpServer.listen(this.config.port, () => {
			const IPV4: string = getIPV4();
			console.log(
				`Network: http://${IPV4}:${this.config.port} \nlocal: http://localhost:${this.config.port}`,
			);
		});
	};
}
