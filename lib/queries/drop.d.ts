import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
export declare function dropTable(table: Table<any>): DropQuery;
declare class DropQuery {
    private readonly table;
    constructor(table: Table<any>);
    execute(databaseProvider: IDatabaseProvider): Promise<{
        changes: number;
        lastID: number;
    }>;
    toSQL(): string;
}
export {};
