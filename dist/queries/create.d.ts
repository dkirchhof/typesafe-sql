import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
export declare function createTable<Type>(table: Table<Type>): CreateQuery<Type>;
export declare type MappedType<Type> = {
    [K in keyof Type]: IColumnOptions<Type[K]>;
};
export declare type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";
export interface IColumnOptions<Type> {
    dataType: "TEXT" | "INT";
    primary?: boolean;
    foreign?: ForeignKey<any>;
    notNull?: boolean;
    unique?: boolean;
    default?: Type;
}
export declare class ForeignKey<Type> {
    readonly table: Table<Type>;
    readonly column: keyof Type;
    readonly onDelete: Action;
    readonly onUpdate: Action;
    constructor(table: Table<Type>, column: keyof Type, onDelete?: Action, onUpdate?: Action);
}
export declare class CreateQuery<Type> {
    private readonly table;
    private columnList;
    private primaryList;
    private foreignList;
    constructor(table: Table<Type>);
    columns(columns: MappedType<Type>): this;
    execute(databaseProvider: IDatabaseProvider): Promise<{
        changes: number;
        lastID: number;
    }>;
    toSQL(): string;
}
