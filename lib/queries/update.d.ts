import { PredicateFactory } from "../Predicate";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Columns, Table } from "../Table";
export declare function update<Type>(table: Table<Type>): UpdateQuery<Type>;
declare class UpdateQuery<Type> {
    private table;
    constructor(table: Table<Type>);
    set(values: Partial<Type>): ExecutableUpdateQuery<Type>;
}
declare class ExecutableUpdateQuery<Type> {
    private values;
    private source;
    private columns;
    private wheres;
    constructor(table: Table<any>, values: Partial<Type>);
    where(predicateFactory: PredicateFactory<Columns<Type>>): this;
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
    private updateToSQL;
    private setValuesToSQL;
    private wheresToSQL;
}
export {};
