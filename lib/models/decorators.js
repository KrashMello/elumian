"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurable = exports.log = void 0;
const express_1 = __importDefault(require("express"));
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
//# sourceMappingURL=decorators.js.map