"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurable = exports.log = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const app = express_1.default.Router();
function log() {
    return (target, propertyKey) => {
        console.log(target, propertyKey);
    };
}
exports.log = log;
function configurable(value) {
    return (target, propertyKey, descriptor) => {
        console.log(target, propertyKey);
        app.get('/', descriptor.value);
        descriptor.configurable = value;
    };
}
exports.configurable = configurable;
