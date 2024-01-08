import type { schemaTables, options as optionsType, schemaUp, schemaDown, schemaFunctions, schemaProcedure } from '../type';
export declare const options: optionsType;
export declare class Schema {
    private makeProceduresQuery;
    private makeFunctionsQuery;
    private makeTablesQuery;
    create(schemaName: string, tables: schemaTables, procedures?: schemaProcedure, functions?: schemaFunctions): schemaUp;
    drop(schemaName: string, tables: string[]): schemaDown;
}
