"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyId = exports.getCacheDataById = exports.singCacheData = exports.setConfig = exports.cacheList = void 0;
const tslib_1 = require("tslib");
const encoder_1 = require("../coder");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const secondsToMidnight = (n) => {
    return ((24 - n.getHours() - 1) * 60 * 60 +
        (60 - n.getMinutes() - 1) * 60 +
        (60 - n.getSeconds()));
};
exports.cacheList = { Auth: [] };
const encoder = new encoder_1.Encoder();
let expireTime = 1 * 1000 * 60 * 60;
function setConfig(expireT) {
    expireTime = expireT * 1000 * 60 * 60;
}
exports.setConfig = setConfig;
function singCacheData(key, data) {
    const time = Math.floor(Math.random() * 10) + 1;
    const encriptedData = {
        id: crypto_1.default.randomUUID(),
        data: encoder.hardEncrypter(data, time),
        expireTime: new Date(new Date().getTime() + secondsToMidnight(new Date()) * expireTime),
    };
    if (exports.cacheList[key] == null)
        exports.cacheList[key] = [];
    exports.cacheList[key]?.push(encriptedData);
    setTimeout(() => {
        exports.cacheList[key]?.forEach((v, i) => {
            if (v.id === encriptedData.id) {
                exports.cacheList[key] = exports.cacheList[key]?.filter((_, k) => k !== i);
            }
        });
    }, expireTime);
    return encriptedData;
}
exports.singCacheData = singCacheData;
function getCacheDataById(key, id) {
    const filterById = exports.cacheList[key]?.filter((v) => v.id === id)[0]
        ?.data;
    if (filterById != null)
        return filterById;
    else
        return 'dont exists data in cache';
}
exports.getCacheDataById = getCacheDataById;
function verifyId(key, id) {
    if (exports.cacheList[key]?.filter((v) => v.id === id)[0] != null)
        return true;
    else
        return false;
}
exports.verifyId = verifyId;
