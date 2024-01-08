"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const os_1 = tslib_1.__importDefault(require("os"));
const router_1 = require("../router");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = tslib_1.__importDefault(require("cors"));
const server = (controllers, whiteList = undefined, port = 5000) => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Utilice el CORS para permitir que el CORS sea habilitado
    if (whiteList !== undefined &&
        whiteList.length > 0 &&
        Array.isArray(whiteList))
        app.use((0, cors_1.default)({
            origin: function (origin, callback) {
                console.log(origin);
                if (typeof origin === 'string' &&
                    whiteList.includes(origin) &&
                    origin !== undefined) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
        }));
    const { networkInterfaces } = os_1.default;
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object
    let IPV4 = '';
    for (const name of Object.keys(nets)) {
        const auxNets = nets[name];
        // Esta función añadirá todas las direcciones de las auxNets a los resultados.
        if (auxNets != null)
            for (const net of auxNets) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
                const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
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
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer);
    (0, router_1.router)(controllers, app, io);
    httpServer.listen(port, () => {
        console.log(`Network: http://${IPV4}:${port} \nlocal: http://localhost:${port}`);
    });
};
exports.default = server;
