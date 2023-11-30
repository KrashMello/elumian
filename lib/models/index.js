"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const index_1 = require("../DB/index");
class Model {
    constructor() {
        this.schemaName = 'public';
        this.tableName = 'test';
    }
    initBD() {
        this.DB = new index_1.DB(this.schemaName, this.tableName);
    }
}
exports.Model = Model;
//# sourceMappingURL=index.js.map