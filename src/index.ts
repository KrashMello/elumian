//create nodejs server with express typescript server EM6?
// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);

// const PORT = process.env.PORT || 3000;

// app.use(express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile('index.html');
//   res.end();
//   console.log('GET /');
// }
import express, { Request, Response } from "express";
import { controllers } from "./routes/index";
import { IRouter } from "@Controller/types";
import "dotenv/config";
import verifyToken from "@Middelware/index";

const app = express();
app.use(express.json());

const info: Array<{ api: string; handler: string; withMiddelware: boolean }> =
  [];

controllers.forEach((controller) => {
  const instance = new controller();

  const prefix = Reflect.getMetadata("prefix", controller);

  const routes: IRouter[] = Reflect.getMetadata("routes", controller);

  routes.forEach(({ method, path, withMiddelware, handlerName }) => {
    if (!withMiddelware)
      app[method](prefix + path, (req: Request, res: Response) => {
        (instance as any)[handlerName](req, res);
      });
    else
      app[method](prefix + path, verifyToken, (req: Request, res: Response) => {
        (instance as any)[handlerName](req, res);
      });

    info.push({
      api: `${method.toLocaleUpperCase()} ${prefix + path}`,
      handler: `${controller.name}.${String(handlerName)}`,
      withMiddelware,
    });
  });
});
console.table(info);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server active in port: ${process.env.SERVER_PORT}`);
});
