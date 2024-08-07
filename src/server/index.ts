import express, { Express } from "express";
import os from "os";
import http from "http";
import { Server, Socket } from "socket.io";
import cors, { CorsOptions } from "cors";
import { loadServices } from "..";
import { router } from "../router/index";
import { ServerConfig } from "./type";

const server = (config: ServerConfig): void => {
  loadServices(config.services);
  const app: Express = express();
  app.use(express.json());
  config.port = config.port ?? 5000;

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || (config.whiteList && config.whiteList.includes(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

  if (config.whiteList && config.whiteList.length > 0) {
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
