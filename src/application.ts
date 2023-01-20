// import { controllers } from './routes/index';
// import express, { Application as ExApplication, Handler }  from "express";
// import { MetadataKeys } from '@Controller/decorators';
// import { IRouter } from '@Controller/types';

// export Class Application {
//    private _instance: ExApplication;
//
//    constructor() {
//      this._instance = express();
//      this.registerRouters();
//    }
//       const info: Array<{ api: string, handler: string }> = [];

//     controllers.forEach((controllerClass) => {
//       const controllerInstance: { [handleName: string]: Handler } = new controllerClass() as any;

//       const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass);
//       const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass);

//       const exRouter = express.Router();

//       routers.forEach(({ method, path, handlerName}) => {
//         exRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));

//         info.push({
//           api: `${method.toLocaleUpperCase()} ${basePath + path}`,
//           handler: `${controllerClass.name}.${String(handlerName)}`,
//         });
//       });

//       this._instance.use(basePath, exRouter);
//     });

//     console.table(info);
//    }
