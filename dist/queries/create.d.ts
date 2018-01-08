import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
export declare class CreateQuery {
    private readonly table;
    constructor(table: Table<any>);
    execute(databaseProvider: IDatabaseProvider): Promise<{
        changes: number;
        lastID: number;
    }>;
    toSQL(): string;
}
