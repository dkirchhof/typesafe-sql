import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
export declare class InsertQuery<Type> {
    private table;
    private values;
    constructor(table: Table<Type>, values: Type);
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
