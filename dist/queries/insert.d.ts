import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
export declare function insertInto<Type>(table: Table<Type>): InsertQuery<Type>;
export declare class InsertQuery<Type> {
    private table;
    private keyList;
    private valueList;
    constructor(table: Table<Type>);
    values(values: Type): this;
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
