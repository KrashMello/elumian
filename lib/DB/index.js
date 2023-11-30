"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mongodb_1 = require("mongodb");
const pg_1 = __importDefault(require("pg"));
require("dotenv/config");
class PGSQL {
    constructor(schemaName = 'public', tableName = 'user') {
        var _a, _b, _c, _d, _e;
        this.query = '';
        this.config = process.env.DB_URL === ''
            ? {
                host: (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : 'localhost',
                port: (_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : 5432,
                database: (_c = process.env.DB_DATABASE) !== null && _c !== void 0 ? _c : 'postges',
                user: (_d = process.env.DB_USERNAME) !== null && _d !== void 0 ? _d : 'postgre',
                password: (_e = process.env.DB_PASSWORD) !== null && _e !== void 0 ? _e : '',
                max: 20,
                idleTimeoutMillis: 1000,
                connectionTimeoutMillis: 2000,
                ssl: false,
            }
            : {
                connectionString: process.env.DB_URL,
                max: 20,
                idleTimeoutMillis: 1000,
                connectionTimeoutMillis: 2000,
                ssl: false,
            };
        this.pool = new pg_1.default.Pool(this.config);
        this.DATE_OID = 1082;
        this.parseDate = (value) => value;
        this.schemaName = schemaName;
        this.tableName = tableName;
        pg_1.default.types.setTypeParser(this.DATE_OID, this.parseDate);
    }
    table(name) {
        if (!(typeof name === 'string'))
            throw new Error('Invalid argument type');
        this.tableName = name;
        return this;
    }
    select(fields = '*') {
        if (!(typeof fields === 'string') && !Array.isArray(fields)) {
            throw new Error('invalid argument type to select query');
        }
        const _fields = typeof fields === 'string' ? [fields] : fields;
        this.query = `SELECT ${_fields.join(', ')} from "${this.schemaName}"."${this.tableName}"`;
        return this;
    }
    where(fields = 'id = 1', option = 'AND') {
        if (!(typeof fields === 'string') && !Array.isArray(fields)) {
            throw new Error('Invalid argument type to where query');
        }
        const _fields = typeof fields === 'string' ? [fields] : fields;
        this.query += ` where ${_fields.join(' ' + option + ' ')}`;
        return this;
    }
    limit(field) {
        if (!(typeof field === 'number')) {
            throw new Error('Invalid argument to limit query');
        }
        this.query += ` limit ${field.toString()}`;
        return this;
    }
    offset(field) {
        if (!(typeof field === 'number')) {
            throw new Error('Invalid argument to offset query');
        }
        this.query += ` offset ${field.toString()}`;
        return this;
    }
    call(procedure, fields = '1') {
        if (!(typeof procedure === 'string') &&
            procedure === null &&
            procedure === undefined &&
            procedure === '' &&
            !(typeof fields === 'string') &&
            !Array.isArray(fields)) {
            throw new Error('Invalid argument to Call query');
        }
        if (this.query !== '')
            throw new Error('Dont have a query');
        const _fields = typeof fields === 'string' ? [fields] : fields;
        this.query = `CALL "${this.schemaName}"."${procedure}"(${_fields.join(', ')})`;
        return this;
    }
    view(fields = '*', view) {
        if (!(typeof fields === 'string') &&
            !Array.isArray(fields) &&
            !(typeof view === 'string') &&
            view === undefined &&
            view === null &&
            view === '') {
            throw new Error('Invalid argument to a view query');
        }
        const _fields = typeof fields === 'string' ? [fields] : fields;
        this.query = `SELECT ${_fields.join(', ')} FROM ${this.schemaName}.${view} `;
        return this;
    }
    queryExec(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(typeof query === 'string') && query === null) {
                throw new Error('Dont have a query');
            }
            const result = this.pool.query(query);
            return yield result;
        });
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(typeof this.query === 'string') && this.query === null) {
                throw new Error('Dont have a query');
            }
            const result = this.pool.query(this.query);
            this.query = '';
            return yield result;
        });
    }
}
class MONGODB {
    constructor(tableName = 'test') {
        var _a, _b;
        this.client = new mongodb_1.MongoClient((_a = process.env.DB_URL) !== null && _a !== void 0 ? _a : 'localhost');
        this.DB_DATABASE = (_b = process.env.DB_DATABASE) !== null && _b !== void 0 ? _b : 'test';
        this.tableName = 'task';
        this.tableName = tableName;
    }
    findOne(query, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                const collection = yield collections.findOne(query, options);
                return collection;
            }
            finally {
                // Ensures that the client will close when you finish/error
                yield this.client.close();
            }
        });
    }
    find(query, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                const collection = collections.find(query, options);
                if ((yield collections.countDocuments(query)) === 0) {
                    return 'No documents found!';
                }
                return collection;
            }
            finally {
                // Ensures that the client will close when you finish/error
                yield this.client.close();
            }
        });
    }
    insertOne(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                // create a document to insert
                const collection = yield collections.insertOne(doc);
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return `A document was inserted with the _id: ${collection.insertedId}`;
            }
            finally {
                yield this.client.close();
            }
        });
    }
    insertMany(docs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                // create many document to insert
                const collection = yield collections.insertMany(docs);
                return `${collection.insertedCount} documents were inserted`;
            }
            finally {
                yield this.client.close();
            }
        });
    }
    updateOne(filter, doc, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                // update a document to insert
                const collection = yield collections.updateOne(filter, doc, options);
                return `${collection.matchedCount} document(s) matched the filter, updated ${collection.modifiedCount} document(s)`;
            }
            finally {
                yield this.client.close();
            }
        });
    }
    updateMany(filter, doc, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                // update many document to insert
                const collection = yield collections.updateMany(filter, doc, options);
                return `Successfully Updated ${collection.modifiedCount} documents`;
            }
            finally {
                yield this.client.close();
            }
        });
    }
    replaceOne(filter, doc, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                // preplace a document to insert
                const collection = yield collections.replaceOne(filter, doc, options);
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return `Modified ${collection.modifiedCount} document(s)`;
            }
            finally {
                yield this.client.close();
            }
        });
    }
    deleteOne(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                // delete a document to insert
                const collection = yield collections.deleteOne(doc);
                if (collection.deletedCount === 1) {
                    return 'Successfully deleted one document.';
                }
                else {
                    return 'No documents matched the query. Deleted 0 documents.';
                }
            }
            finally {
                yield this.client.close();
            }
        });
    }
    deleteMany(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = this.client.db(this.DB_DATABASE);
                const collections = database.collection(this.tableName);
                // delete many document to insert
                const collection = yield collections.deleteMany(doc);
                return `Successfully deleted ${collection.deletedCount} document.`;
            }
            finally {
                yield this.client.close();
            }
        });
    }
}
exports.DB = process.env.DB_CONNECTION === 'pgsql'
    ? PGSQL
    : process.env.DB_CONNECTION === 'mongodb'
        ? MONGODB
        : PGSQL;
//# sourceMappingURL=index.js.map