import { Table } from "..";

export abstract class BaseQuery<Type> {
    constructor(protected readonly table: Table<Type>) { }

    public abstract toSQL(): string;
}
