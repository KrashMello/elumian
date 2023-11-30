"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../cache/index");
function verifyToken(req, res, next) {
    const id = req.header('x-access-id');
    if (id == null) {
        return res.status(403).send({
            message: 'No token provided!'
        });
    }
    if ((0, index_1.verifyId)('Auth', id) === false)
        return res.status(401).json({
            status: 1,
            message: 'Unauthorized!'
        });
    next();
}
exports.default = verifyToken;
//# sourceMappingURL=index.js.map