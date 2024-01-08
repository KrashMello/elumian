"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const pg_1 = tslib_1.__importDefault(require("pg"));
require("dotenv/config");
class PGSQL {
    constructor(schemaName = 'public', tableName = 'user') {
        this.query = '';
        this.config = process.env.DB_URL === ''
            ? {
                host: process.env.DB_HOST ?? 'localhost',
                port: process.env.DB_PORT ?? 5432,
                database: process.env.DB_DATABASE ?? 'postges',
                user: process.env.DB_USERNAME ?? 'postgre',
                password: process.env.DB_PASSWORD ?? '',
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
    async queryExec(query) {
        if (!(typeof query === 'string') && query === null) {
            throw new Error('Dont have a query');
        }
        const result = await this.pool.query(query);
        return result;
    }
    async exec() {
        if (!(typeof this.query === 'string') && this.query === null) {
            throw new Error('Dont have a query');
        }
        const result = this.pool.query(this.query);
        this.query = '';
        return await result;
    }
}
class MONGODB {
    constructor(tableName = 'test') {
        this.client = new mongodb_1.MongoClient(process.env.DB_URL ?? 'localhost');
        this.DB_DATABASE = process.env.DB_DATABASE ?? 'test';
        this.tableName = 'task';
        this.tableName = tableName;
    }
    async findOne(query, options = {}) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            const collection = await collections.findOne(query, options);
            return collection;
        }
        finally {
            // Ensures that the client will close when you finish/error
            await this.client.close();
        }
    }
    async find(query, options = {}) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            const collection = collections.find(query, options);
            if ((await collections.countDocuments(query)) === 0) {
                return 'No documents found!';
            }
            return collection;
        }
        finally {
            // Ensures that the client will close when you finish/error
            await this.client.close();
        }
    }
    async insertOne(doc) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            // create a document to insert
            const collection = await collections.insertOne(doc);
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return `A document was inserted with the _id: ${collection.insertedId}`;
        }
        finally {
            await this.client.close();
        }
    }
    async insertMany(docs) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            // create many document to insert
            const collection = await collections.insertMany(docs);
            return `${collection.insertedCount} documents were inserted`;
        }
        finally {
            await this.client.close();
        }
    }
    async updateOne(filter, doc, options = {}) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            // update a document to insert
            const collection = await collections.updateOne(filter, doc, options);
            return `${collection.matchedCount} document(s) matched the filter, updated ${collection.modifiedCount} document(s)`;
        }
        finally {
            await this.client.close();
        }
    }
    async updateMany(filter, doc, options = {}) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            // update many document to insert
            const collection = await collections.updateMany(filter, doc, options);
            return `Successfully Updated ${collection.modifiedCount} documents`;
        }
        finally {
            await this.client.close();
        }
    }
    async replaceOne(filter, doc, options = {}) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            // preplace a document to insert
            const collection = await collections.replaceOne(filter, doc, options);
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return `Modified ${collection.modifiedCount} document(s)`;
        }
        finally {
            await this.client.close();
        }
    }
    async deleteOne(doc) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            // delete a document to insert
            const collection = await collections.deleteOne(doc);
            if (collection.deletedCount === 1) {
                return 'Successfully deleted one document.';
            }
            else {
                return 'No documents matched the query. Deleted 0 documents.';
            }
        }
        finally {
            await this.client.close();
        }
    }
    async deleteMany(doc) {
        try {
            const database = this.client.db(this.DB_DATABASE);
            const collections = database.collection(this.tableName);
            // delete many document to insert
            const collection = await collections.deleteMany(doc);
            return `Successfully deleted ${collection.deletedCount} document.`;
        }
        finally {
            await this.client.close();
        }
    }
}
exports.DB = process.env.DB_CONNECTION === 'pgsql'
    ? PGSQL
    : process.env.DB_CONNECTION === 'mongodb'
        ? MONGODB
        : PGSQL;
