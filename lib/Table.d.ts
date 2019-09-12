import { Column } from "./Column";
import { CreateQuery } from "./queries/create";
import { DeleteQuery } from "./queries/delete";
import { DropQuery } from "./queries/drop";
import { InsertQuery } from "./queries/insert";
import { SelectQuery } from "./queries/select";
import { UpdateQuery } from "./queries/update";
export interface IColumnOptions<Type> {
    dataType: DataType;
    primary?: boolean;
    references?: ForeignKey<any>;
    notNull?: boolean;
    unique?: boolean;
    default?: Type;
}
export declare class ForeignKey<Type> {
    readonly table: Table<Type>;
    readonly column: keyof Type;
    readonly onDelete?: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE" | undefined;
    readonly onUpdate?: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE" | undefined;
    constructor(table: Table<Type>, column: keyof Type, onDelete?: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE" | undefined, onUpdate?: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE" | undefined);
}
export declare type ColumnOptions<Type> = {
    [K in keyof Type]: IColumnOptions<Type[K]>;
};
export declare type Columns<Type> = {
    [K in keyof Type]-?: Column<Type[K]>;
};
export declare type NullableColumns<Type> = {
    [K in keyof Type]-?: Column<Type[K] | null>;
};
export declare type DataType = "NULL" | "INTEGER" | "REAL" | "TEXT" | "BLOB";
export declare type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";
export declare type AggregationType = "COUNT" | "SUM" | "AVG" | "MIN" | "MAX";
export declare class Table<Type> {
    readonly tableName: string;
    columns: ColumnOptions<Type>;
    constructor(tableName: string, columns: ColumnOptions<Type>);
    create(): CreateQuery;
    drop(): DropQuery;
    query<Alias extends string>(alias: Alias): SelectQuery<Record<Alias, Columns<Type>>>;
    insert(tuples: Type | Type[]): InsertQuery<Type>;
    update(values: Partial<Type>): UpdateQuery<Type>;
    delete(): DeleteQuery<Type>;
}
