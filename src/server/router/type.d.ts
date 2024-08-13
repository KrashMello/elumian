interface RouteInfo {
  api: string;
  handler: string;
  protected: boolean;
}

interface SocketRoute {
  method: string;
  path: string;
  functionSocket: (io: any, socket: any) => void;
}

type SocketInfo = { method: string; path: string; handlerName: string };
