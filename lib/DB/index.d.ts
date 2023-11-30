import 'dotenv/config';
declare class PGSQL {
    private readonly schemaName;
    private tableName;
    private query;
    private readonly config;
    private readonly pool;
    private readonly DATE_OID;
    private readonly parseDate;
    constructor(schemaName?: string, tableName?: string);
    table(name: string): this;
    select(fields?: string | string[]): this;
    where(fields?: string | string[], option?: 'AND' | 'OR'): this;
    limit(field: number): this;
    offset(field: number): this;
    call(procedure: string, fields?: string | string[]): this;
    view(fields: string | string[] | undefined, view: string): this;
    queryExec(query: string): Promise<any>;
    exec(): Promise<any>;
}
declare class MONGODB {
    private readonly client;
    private readonly DB_DATABASE;
    private readonly tableName;
    constructor(tableName?: string);
    findOne(query: object, options?: object): Promise<any>;
    find(query: object, options?: object): Promise<any>;
    insertOne(doc: object): Promise<any>;
    insertMany(docs: object[]): Promise<any>;
    updateOne(filter: object, doc: object[], options?: object): Promise<any>;
    updateMany(filter: object, doc: object[], options?: object): Promise<any>;
    replaceOne(filter: object, doc: object[], options?: object): Promise<any>;
    deleteOne(doc: object): Promise<any>;
    deleteMany(doc: object): Promise<any>;
}
export declare const DB: typeof PGSQL | typeof MONGODB;
export {};
