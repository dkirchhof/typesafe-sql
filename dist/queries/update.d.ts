import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
export declare class UpdateQuery<Type> {
    private table;
    private values;
    private filters;
    constructor(table: Table<Type>, values: Partial<Type>);
    where<Key extends keyof Type>(column: Key, value: Type[Key]): this;
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
