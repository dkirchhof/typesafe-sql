import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Source } from "../Source";
import { Table } from "../Table";
export declare function insertInto<Type>(table: Table<Type>): InsertQuery<Type>;
declare class InsertQuery<Type> {
    private source;
    constructor(table: Table<Type>);
    values(tuples: Type | Type[]): ExecutableInsertQuery;
}
declare class ExecutableInsertQuery {
    private source;
    private tuples;
    constructor(source: Source, tuples: any[]);
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
export {};
