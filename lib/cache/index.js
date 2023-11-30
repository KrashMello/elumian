"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyId = exports.getCacheDataById = exports.singCacheData = exports.setConfig = exports.cacheList = void 0;
const index_1 = require("../coder/index");
const uuid_1 = require("uuid");
const secondsToMidnight = (n) => {
    return ((24 - n.getHours() - 1) * 60 * 60 +
        (60 - n.getMinutes() - 1) * 60 +
        (60 - n.getSeconds()));
};
exports.cacheList = { Auth: [] };
const encoder = new index_1.Encoder();
let expireTime = 1 * 1000 * 60 * 60;
function setConfig(expireT) {
    expireTime = expireT * 1000 * 60 * 60;
}
exports.setConfig = setConfig;
function singCacheData(key, data) {
    var _a;
    const time = Math.floor(Math.random() * 10) + 1;
    const encriptedData = {
        id: (0, uuid_1.v4)(),
        data: encoder.hardEncrypter(data, time),
        expireTime: new Date(new Date().getTime() + secondsToMidnight(new Date()) * expireTime),
    };
    if (exports.cacheList[key] == null)
        exports.cacheList[key] = [];
    (_a = exports.cacheList[key]) === null || _a === void 0 ? void 0 : _a.push(encriptedData);
    setTimeout(() => {
        var _a;
        (_a = exports.cacheList[key]) === null || _a === void 0 ? void 0 : _a.forEach((v, i) => {
            var _a;
            if (v.id === encriptedData.id) {
                exports.cacheList[key] = (_a = exports.cacheList[key]) === null || _a === void 0 ? void 0 : _a.filter((_, k) => k !== i);
            }
        });
    }, expireTime);
    return encriptedData;
}
exports.singCacheData = singCacheData;
function getCacheDataById(key, id) {
    var _a, _b;
    const filterById = (_b = (_a = exports.cacheList[key]) === null || _a === void 0 ? void 0 : _a.filter((v) => v.id === id)[0]) === null || _b === void 0 ? void 0 : _b.data;
    if (filterById != null)
        return filterById;
    else
        return 'dont exists data in cache';
}
exports.getCacheDataById = getCacheDataById;
function verifyId(key, id) {
    var _a;
    if (((_a = exports.cacheList[key]) === null || _a === void 0 ? void 0 : _a.filter((v) => v.id === id)[0]) != null)
        return true;
    else
        return false;
}
exports.verifyId = verifyId;
//# sourceMappingURL=index.js.map