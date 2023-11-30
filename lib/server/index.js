"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const os_1 = __importDefault(require("os"));
const index_1 = require("../router/index");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const server = (controllers, whiteList = undefined, port = 5000) => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
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
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer);
    (0, index_1.router)(controllers, app, io);
    httpServer.listen(port, () => {
        console.log(`server active: http://${IPV4}:${port} \nserver active: http://localhost:${port}`);
    });
};
exports.default = server;
//# sourceMappingURL=index.js.map