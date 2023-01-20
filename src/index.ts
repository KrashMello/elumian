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
