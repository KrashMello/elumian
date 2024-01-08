"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../cache");
function verifyToken(req, res, next) {
    const id = req.header('x-access-id');
    if (id == null) {
        return res.status(403).send({
            message: 'No token provided!',
        });
    }
    if ((0, cache_1.verifyId)('Auth', id) === false)
        return res.status(401).json({
            status: 1,
            message: 'Unauthorized!',
        });
    next();
}
exports.default = verifyToken;
