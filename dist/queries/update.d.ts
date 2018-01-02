import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
export declare function update<Type>(table: Table<Type>): UpdateQuery<Type>;
export declare class UpdateQuery<Type> {
    private table;
    private values;
    private filters;
    constructor(table: Table<Type>);
    set(values: Partial<Type>): this;
    where<Key extends keyof Type>(key: Key, value: Type[Key]): this;
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
