import express from "express";
import os from "os";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Modules } from "..";
import { router } from "../router/index";

const server = async (config: {
  controllers: any[];
  services: any[];
  whiteList?: string[];
  port?: number;
  viewsDir?: string;
}) => {
  Modules(config.services);
  const app = express();
  app.use(express.json());
  config.port = config.port ?? 5000;
  config.viewsDir = config.viewsDir ?? "src/views";
  // Utilice el CORS para permitir que el CORS sea habilitado
  if (
    config.whiteList &&
    config.whiteList.length > 0 &&
    Array.isArray(config.whiteList)
  )
    app.use(
      cors({
        origin: function (origin: string | undefined, callback) {
          console.log(origin);
          if (
            typeof origin === "string" &&
            config.whiteList.includes(origin) &&
            origin !== undefined
          ) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
      }),
    );
  const { networkInterfaces } = os;
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object
  let IPV4 = "";

  for (const name of Object.keys(nets)) {
    const auxNets = nets[name];
    // Esta función añadirá todas las direcciones de las auxNets a los resultados.
    if (auxNets != null)
      for (const net of auxNets) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
        // Añadir la dirección IPV4 a los resultados
        if (net.family === familyV4Value && !net.internal) {
          const auxResult = results[name];
          // Elimine todos los resultados del mapa de resultados.
          if (auxResult == null) {
            results[name] = [];
          }
          IPV4 = net.address;
          results[name].push(net.address);
        }
      }
  }

  const httpServer = createServer(app);

  const io = new Server(httpServer);

  await router(config.controllers, app, io);
  httpServer.listen(config.port, () => {
    console.log(
      `Network: http://${IPV4}:${config.port} \nlocal: http://localhost:${config.port}`,
    );
  });
};

export default server;
