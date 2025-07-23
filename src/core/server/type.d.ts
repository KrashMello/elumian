export interface ServerConfig {
  whiteList?: string[];
  port?: number;
  modules: any[]
}
export interface RouteInfo {
  api: string;
  handler: string;
  protected: boolean;
}

export interface SocketRoute {
  method: string;
  path: string;
  functionSocket: (io: any, socket: any) => void;
}

export type SocketInfo = { method: string; path: string; handlerName: string };
