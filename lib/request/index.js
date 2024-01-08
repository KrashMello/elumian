"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidator = void 0;
const tslib_1 = require("tslib");
const validator_1 = tslib_1.__importDefault(require("validator"));
const service_1 = require("./service");
class RequestValidator {
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
                            result = message.alpha ?? 'el campo solo debe tener letras!';
                        }
                        break;
                    case 'alphaSimbols':
                        if (typeof data[key] === 'string' &&
                            (0, service_1.isAlphaSimbols)(data[key], this.lang) === false &&
                            data[key] != null) {
                            result =
                                message.alphaSimbols ??
                                    'el campo solo debe contener letras y /_';
                        }
                        break;
                    case 'alphaNumeric':
                        if (typeof data[key] === 'string' &&
                            !validator_1.default.isAlphanumeric(data[key]) &&
                            data[key] != null) {
                            result =
                                message.alphaNumeric ??
                                    'el campo solo debe tener letras y numeros';
                        }
                        break;
                    case 'alphaNumericSimbols':
                        if (typeof data[key] !== 'string' ||
                            ((0, service_1.isAlphaNumericSimbols)(data[key]) === false && data[key] != null)) {
                            result =
                                message.alphaNumericSimbols ??
                                    'el campo debe contener solo letras, numeros y -._#,/';
                        }
                        break;
                    case 'required':
                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                        if (!data[key]) {
                            result = message.required ?? 'el campo es requerido';
                        }
                        break;
                    case 'max':
                        if (typeof data[key] === 'string' &&
                            data[key]?.length > MinMaxLength) {
                            result =
                                message.max ??
                                    `el campo no debe tener mas de ${MinMaxLength} caracteres`;
                        }
                        break;
                    case 'min':
                        if (typeof data[key] === 'string' &&
                            data[key]?.length < MinMaxLength) {
                            result =
                                message.min ??
                                    `el campo no debe tener menos de ${MinMaxLength} caracteres`;
                        }
                        break;
                    case 'email':
                        if (typeof data[key] === 'string' &&
                            !validator_1.default.isEmail(data[key])) {
                            result =
                                message.email ??
                                    'el campo debe ser un correo electronico ejemplo: example@myweb.com';
                        }
                        break;
                    case 'boolean':
                        if (typeof data[key] !== 'boolean') {
                            result = message.boolean ?? 'el campo debe ser booleano';
                        }
                        break;
                    case 'array':
                        if (!Array.isArray(data[key])) {
                            result = message.array ?? 'el campo debe ser un arreglo';
                        }
                        break;
                }
                if (result != null)
                    optionsResult.push(result);
            });
            if (optionsResult.length > 0)
                errors = { ...errors, [key]: optionsResult };
        });
        return Object.values(errors).length === 0 ? true : errors;
    }
}
exports.RequestValidator = RequestValidator;
