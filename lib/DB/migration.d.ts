import { type schemas } from './type';
export declare class Migration {
    private readonly DB;
    private readonly migrationsUp;
    private readonly migrationsDown;
    constructor(schemas: schemas[]);
    up(): void;
    down(): void;
    start(type: 'up' | 'down'): void;
}
