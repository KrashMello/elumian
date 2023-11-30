"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlpha = exports.isAlphaNumericSimbols = exports.isAlphaSimbols = void 0;
const alpha = {
    'es-ES': /^[a-zA-Z-.\s&,_#/]+$/i
};
const alphanumeric = {
    'es-ES': /^[a-z0-9A-Z-.\s&,_#/]+$/i
};
function isAlphaSimbols(_str, locale = 'es-ES', options = { ignore: '' }) {
    let str = _str;
    const ignore = options.ignore;
    if (ignore instanceof RegExp || typeof ignore === 'string') {
        if (ignore instanceof RegExp) {
            str = str.replace(ignore, '');
        }
        else if (typeof ignore === 'string') {
            str = str.replace(new RegExp('['.concat(ignore.replace(/[[\]{}()*+?.,\\^$|#]/g, '\\$&'), ']'), 'g'), ''); // escape regex for ignore
        }
        else {
            throw new Error('ignore should be instance of a String or RegExp');
        }
    }
    if (locale in alpha) {
        return alpha['es-ES'].test(str);
    }
    throw new Error("Invalid locale '".concat(locale, "'"));
}
exports.isAlphaSimbols = isAlphaSimbols;
function isAlphaNumericSimbols(_str, locale = 'es-ES', options = {}) {
    let str = _str;
    const ignore = options.ignore;
    if (ignore instanceof RegExp || typeof ignore === 'string') {
        if (ignore instanceof RegExp) {
            str = str.replace(ignore, '');
        }
        else if (typeof ignore === 'string') {
            str = str.replace(new RegExp('['.concat(ignore.replace(/[[\]{}()*+?.,\\^$|#]/g, '\\$&'), ']'), 'g'), ''); // escape regex for ignore
        }
        else {
            throw new Error('ignore should be instance of a String or RegExp');
        }
    }
    if (locale in alphanumeric) {
        return alphanumeric['es-ES'].test(str);
    }
    throw new Error("Invalid locale '".concat(locale, "'"));
}
exports.isAlphaNumericSimbols = isAlphaNumericSimbols;
function isAlpha(_str, locale = 'es-ES', options = {}) {
    let str = _str;
    const { ignore } = options;
    if (ignore instanceof RegExp || typeof ignore === 'string') {
        if (ignore instanceof RegExp) {
            str = str.replace(ignore, '');
        }
        else if (typeof ignore === 'string') {
            str = str.replace(new RegExp(`[${ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&')}]`, 'g'), ''); // escape regex for ignore
        }
        else {
            throw new Error('ignore should be instance of a String or RegExp');
        }
    }
    if (locale in alpha) {
        return alpha['es-ES'].test(str);
    }
    throw new Error(`Invalid locale '${locale}'`);
}
exports.isAlpha = isAlpha;
//# sourceMappingURL=service.js.map