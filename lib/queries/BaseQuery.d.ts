import { Table } from "..";
export declare abstract class BaseQuery<Type> {
    protected readonly table: Table<Type>;
    constructor(table: Table<Type>);
    abstract toSQL(): string;
}
