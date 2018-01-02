import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
export declare function deleteFrom<Type>(table: Table<Type>): DeleteQuery<Type>;
export declare class DeleteQuery<Type> {
    private table;
    private filters;
    constructor(table: Table<Type>);
    where<Key extends keyof Type>(key: Key, value: Type[Key]): this;
    execute(databaseProvider: IDatabaseProvider): Promise<number>;
    toSQL(): string;
}
