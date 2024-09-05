import * as express from "express";
import type { Express } from "express";
import * as os from "os";
import * as http from "http";
import { Server, Socket } from "socket.io";
import * as cors from "cors";
import { type CorsOptions } from "cors";
import { Elumian } from "elumian/core";
import { router } from "./router/index";
import { ServerConfig } from "./type";

function loadServices(services: any[]) {
  services.forEach((v) => {
    const service = new v();
    const prefix = Reflect.getMetadata("prefix", v);
    if (!Elumian[prefix]) Elumian[prefix] = service;
  });
}
export const server = (config: ServerConfig): void => {
  loadServices(config.services);
  const app: Express = express();
  app.use(express.json());
  config.port = config.port ?? 5000;

  if (config.whiteList && config.whiteList.length > 0) {
    const corsOptions: CorsOptions =
      typeof config.whiteList === "object"
        ? {
            origin: (origin, callback) => {
              if (
                !origin ||
                (config.whiteList && config.whiteList.includes(origin))
              ) {
                callback(null, true);
              } else {
                callback(new Error("Not allowed by CORS"));
              }
            },
          }
        : {
            origin: config.whiteList,
          };
    app.use(cors(corsOptions));
  }

  const httpServer: http.Server = http.createServer(app);
  const io: Server = new Server(httpServer);
  router(config.controllers, app, io);

  httpServer.listen(config.port, () => {
    const IPV4: string = getIPV4();
    console.log(
      `Network: http://${IPV4}:${config.port} \nlocal: http://localhost:${config.port}`,
    );
  });
};

export function getIPV4(): string {
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

export default server;
