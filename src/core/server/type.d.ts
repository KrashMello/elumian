export interface ServerConfig {
	port?: number;
}
export interface RouteInfo {
	controller: string;
	method: string;
	path: string;
}

export interface SocketRoute {
	method: string;
	path: string;
	functionSocket: (io: any, socket: any) => void;
}

export type SocketInfo = { method: string; path: string; handlerName: string };
