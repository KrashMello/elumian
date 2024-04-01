"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elumian = void 0;
const client_1 = require("@prisma/client");
require("reflect-metadata");
class Elumian {
    constructor() { }
    static getInstance() {
        if (!this.instance["prisma"])
            this.instance = {
                ...this.instance,
                prisma: new client_1.PrismaClient(),
            };
        let aux = [];
        this.services.forEach((v) => {
            const prefix = Reflect.getMetadata("prefix", v);
            if (!this.instance[prefix])
                aux.push([prefix, new v()]);
        });
        this.instance = { ...this.instance, ...Object.fromEntries(aux) };
        return this.instance;
    }
}
exports.Elumian = Elumian;
Elumian.instance = {};
