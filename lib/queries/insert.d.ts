import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
export declare class InsertQuery<Type> {
    private table;
    private tuples;
    constructor(table: Table<Type>, tuples: Type | Type[]);
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
