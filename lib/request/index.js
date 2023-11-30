"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestClass = void 0;
const validator_1 = __importDefault(require("validator"));
const service_1 = require("./service");
class RequestClass {
    constructor(optionsToValidate, message = {}) {
        this.lang = 'es-ES';
        this.optionsToValidate = optionsToValidate;
        this.message = message;
    }
    validate(get = false) {
        return (req, res, next) => {
            let validate;
            if (get)
                validate = this.compareValue(req.query, this.optionsToValidate, this.message);
            else {
                validate = this.compareValue(req.body, this.optionsToValidate, this.message);
            }
            if (validate !== true) {
                res.status(401).json(validate);
                return;
            }
            next();
        };
    }
    compareValue(data, optionsToValidate, message = {}) {
        const dataKey = Object.keys(data);
        const requestKey = Object.keys(optionsToValidate);
        let uncoinsident = 0;
        dataKey.forEach((value) => {
            if (!requestKey.includes(value))
                uncoinsident++;
        });
        if (uncoinsident > 0)
            return `campos unicamente necesarios: ${requestKey.toString()}`;
        let errors = {};
        requestKey.forEach((key) => {
            const optionsByKey = optionsToValidate[key];
            if (optionsByKey == null)
                return;
            const options = optionsByKey.split('|');
            const optionsResult = [];
            options.forEach((option) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                let result = null;
                let MinMaxLength = 0;
                if (option.includes('max') || option.includes('min')) {
                    const auxOption = option.split(':');
                    // option = auxOption[0]
                    MinMaxLength = Number(auxOption[1]);
                }
                switch (option) {
                    case 'alpha':
                        if (typeof data[key] === 'string' &&
                            (0, service_1.isAlpha)(data[key], this.lang) === false &&
                            data[key] != null) {
                            result = (_a = message.alpha) !== null && _a !== void 0 ? _a : 'el campo solo debe tener letras!';
                        }
                        break;
                    case 'alphaSimbols':
                        if (typeof data[key] === 'string' &&
                            (0, service_1.isAlphaSimbols)(data[key], this.lang) === false &&
                            data[key] != null) {
                            result =
                                (_b = message.alphaSimbols) !== null && _b !== void 0 ? _b : 'el campo solo debe contener letras y /_';
                        }
                        break;
                    case 'alphaNumeric':
                        if (typeof data[key] === 'string' &&
                            !validator_1.default.isAlphanumeric(data[key]) &&
                            data[key] != null) {
                            result =
                                (_c = message.alphaNumeric) !== null && _c !== void 0 ? _c : 'el campo solo debe tener letras y numeros';
                        }
                        break;
                    case 'alphaNumericSimbols':
                        if (typeof data[key] !== 'string' ||
                            ((0, service_1.isAlphaNumericSimbols)(data[key]) === false && data[key] != null)) {
                            result =
                                (_d = message.alphaNumericSimbols) !== null && _d !== void 0 ? _d : 'el campo debe contener solo letras, numeros y -._#,/';
                        }
                        break;
                    case 'required':
                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                        if (!data[key]) {
                            result = (_e = message.required) !== null && _e !== void 0 ? _e : 'el campo es requerido';
                        }
                        break;
                    case 'max':
                        if (typeof data[key] === 'string' &&
                            ((_f = data[key]) === null || _f === void 0 ? void 0 : _f.length) > MinMaxLength) {
                            result =
                                (_g = message.max) !== null && _g !== void 0 ? _g : `el campo no debe tener mas de ${MinMaxLength} caracteres`;
                        }
                        break;
                    case 'min':
                        if (typeof data[key] === 'string' &&
                            ((_h = data[key]) === null || _h === void 0 ? void 0 : _h.length) < MinMaxLength) {
                            result =
                                (_j = message.min) !== null && _j !== void 0 ? _j : `el campo no debe tener menos de ${MinMaxLength} caracteres`;
                        }
                        break;
                    case 'email':
                        if (typeof data[key] === 'string' &&
                            !validator_1.default.isEmail(data[key])) {
                            result =
                                (_k = message.email) !== null && _k !== void 0 ? _k : 'el campo debe ser un correo electronico ejemplo: example@myweb.com';
                        }
                        break;
                    case 'boolean':
                        if (typeof data[key] !== 'boolean') {
                            result = (_l = message.boolean) !== null && _l !== void 0 ? _l : 'el campo debe ser booleano';
                        }
                        break;
                    case 'array':
                        if (!Array.isArray(data[key])) {
                            result = (_m = message.array) !== null && _m !== void 0 ? _m : 'el campo debe ser un arreglo';
                        }
                        break;
                }
                if (result != null)
                    optionsResult.push(result);
            });
            if (optionsResult.length > 0)
                errors = Object.assign(Object.assign({}, errors), { [key]: optionsResult });
        });
        return Object.values(errors).length === 0 ? true : errors;
    }
}
exports.RequestClass = RequestClass;
//# sourceMappingURL=index.js.map