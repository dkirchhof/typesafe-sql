import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Source } from "../Source";
import { Table } from "../Table";
export declare function replaceInto<Type>(table: Table<Type>): ReplaceQuery<Type>;
declare class ReplaceQuery<Type> {
    private source;
    constructor(table: Table<Type>);
    values(tuples: Type | Type[]): ExecutableReplaceQuery;
}
declare class ExecutableReplaceQuery {
    private source;
    private tuples;
    constructor(source: Source, tuples: any[]);
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
export {};
