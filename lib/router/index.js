"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const tslib_1 = require("tslib");
const middelware_1 = tslib_1.__importDefault(require("../middelware"));
const os_1 = tslib_1.__importDefault(require("os"));
require("reflect-metadata");
const { networkInterfaces } = os_1.default;
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object
let IPV4 = '';
for (const name of Object.keys(nets)) {
    const auxNets = nets[name];
    if (auxNets != null)
        for (const net of auxNets) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
            if (net.family === familyV4Value && !net.internal) {
                const auxResult = results[name];
                if (auxResult == null) {
                    results[name] = [];
                }
                IPV4 = net.address;
                results[name].push(net.address);
            }
        }
}
const info = [];
const infoSocket = [];
const socketRouter = [];
function router(controllers, app, io, Middelware = middelware_1.default) {
    controllers.forEach((Controller) => {
        const instance = new Controller();
        const prefix = Reflect.getMetadata('prefix', Controller);
        const routes = Reflect.getMetadata('routes', Controller);
        const routesSocket = Reflect.getMetadata('routesSocket', Controller);
        routes.forEach(({ method, path, withMiddelware, handlerName, requestValidator }) => {
            if (typeof requestValidator === 'undefined' && !withMiddelware) {
                app[method](prefix.concat('', path), (req, res) => {
                    instance[handlerName](req, res);
                });
            }
            if (typeof requestValidator !== 'undefined' && withMiddelware) {
                app[method](prefix.concat('', path), Middelware, requestValidator, (req, res) => {
                    instance[handlerName](req, res);
                });
            }
            else if (typeof requestValidator !== 'undefined') {
                app[method](prefix.concat('', path), requestValidator, (req, res) => {
                    instance[handlerName](req, res);
                });
            }
            else {
                app[method](prefix.concat('', path), Middelware, (req, res) => {
                    instance[handlerName](req, res);
                });
            }
            info.push({
                api: `${method.toLocaleUpperCase()} http://${IPV4}:${process.env.SERVER_PORT ?? 5000}${prefix.concat('', path)}`,
                handler: `${Controller.name}.${String(handlerName)}`,
                withMiddelware,
            });
        });
        if (routesSocket != null)
            routesSocket.forEach(({ method, pathName, handlerName }) => {
                socketRouter.push({
                    method,
                    path: prefix.concat(':', pathName),
                    functionSocket: (io, socket) => {
                        instance[handlerName](io, socket);
                    },
                });
                infoSocket.push({
                    method,
                    path: prefix.concat(':', pathName),
                    handlerName: `${Controller.name}.${String(handlerName)}`,
                });
            });
    });
    app.use((_req, res) => {
        res.status(404).json({ message: 'ruta no encontrada!' });
    });
    io.on('connection', (socket) => {
        console.log(`id is connect: ${socket.id}`);
        socketRouter.forEach(({ method, path, functionSocket }) => {
            console.log(method, path);
            functionSocket(io, socket);
        });
    });
    console.table(info);
    if (infoSocket.length > 0)
        console.table(infoSocket);
}
exports.router = router;
