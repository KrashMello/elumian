import type { options as optionsType } from '../type';
export declare const DataType: optionsType;
export declare class Model {
    protected schemaName: string;
    protected tableName: string;
    DB: any;
    protected exclude: string[];
    protected get excludeKeys(): string[];
    protected set excludeKeys(values: string[]);
    protected init(): void;
    findAll(): Promise<Array<Record<any, string>>>;
    count(): Promise<number>;
}
