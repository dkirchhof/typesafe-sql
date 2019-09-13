import { PredicateFactory } from "../Predicate";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Columns, Table } from "../Table";
export declare function deleteFrom<Type>(table: Table<Type>): DeleteQuery<Type>;
declare class DeleteQuery<Type> {
    private source;
    private columns;
    private wheres;
    constructor(table: Table<Type>);
    where(predicateFactory: PredicateFactory<Columns<Type>>): this;
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
    private deleteToSQL;
    private wheresToSQL;
}
export {};
