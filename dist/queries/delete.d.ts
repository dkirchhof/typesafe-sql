import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
export declare class DeleteQuery<Type> {
    private table;
    private filters;
    constructor(table: Table<Type>);
    where<Key extends keyof Type>(column: Key, value: Type[Key]): this;
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
