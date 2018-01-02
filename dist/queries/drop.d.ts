import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
export declare function dropTable<Type>(table: Table<Type>): DropQuery<Type>;
export declare class DropQuery<Type> {
    private readonly table;
    constructor(table: Table<Type>);
    execute(databaseProvider: IDatabaseProvider): Promise<void>;
    toSQL(): string;
}
