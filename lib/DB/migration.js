"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration = void 0;
const db_1 = require(".");
class Migration {
    constructor(schemas) {
        this.migrationsUp = {
            schemas: '',
            tables: '',
            ref: '',
            procedures: '',
            functions: '',
        };
        this.migrationsDown = {
            schemas: '',
            tables: '',
            ref: '',
        };
        this.DB = new db_1.DB();
        schemas.forEach((schema) => {
            this.migrationsUp.schemas += schema.up.schema;
            this.migrationsUp.tables += schema.up.tables;
            this.migrationsUp.ref += schema.up.ref;
            this.migrationsUp.functions += schema.up.functions;
            this.migrationsUp.procedures += schema.up.procedures;
            this.migrationsDown.schemas += schema.down.schema;
            this.migrationsDown.tables += schema.down.tables;
        });
    }
    up() {
        console.log('Migration Start');
        try {
            // console.log({ schema: this.migrationsUp.schemas, tables: this.migrationsUp.tables, ref: this.migrationsUp.ref, functions: this.migrationsUp.functions, procedures: this.migrationsUp.procedures })
            this.DB.queryExec(this.migrationsUp.schemas)
                .then((_res) => {
                this.DB.queryExec(this.migrationsUp.tables)
                    .then((_res) => {
                    this.DB.queryExec(this.migrationsUp.functions).catch((err) => {
                        throw new Error(err);
                    });
                    this.DB.queryExec(this.migrationsUp.procedures).catch((err) => {
                        throw new Error(err);
                    });
                    this.DB.queryExec(this.migrationsUp.ref).catch((err) => {
                        throw new Error(err);
                    });
                })
                    .catch((err) => {
                    throw new Error(err);
                });
            })
                .catch((err) => {
                throw new Error(err);
            });
            console.log('Migration Done');
        }
        catch (err) {
            console.log(err);
            console.log('Migration Failed');
        }
    }
    down() {
        console.log('Migration Start');
        try {
            this.DB.queryExec(this.migrationsDown.tables).then((_res) => {
                this.DB.queryExec(this.migrationsDown.schemas);
            });
            console.log('Migration Done');
        }
        catch (err) {
            console.log(err);
        }
    }
    start(type) {
        if (type === 'up')
            this.up();
        else if (type === 'down')
            this.down();
        else
            console.log('invalid type');
    }
}
exports.Migration = Migration;
