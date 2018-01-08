import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
export declare class DropQuery {
    private readonly table;
    constructor(table: Table<any>);
    execute(databaseProvider: IDatabaseProvider): Promise<void>;
    toSQL(): string;
}
