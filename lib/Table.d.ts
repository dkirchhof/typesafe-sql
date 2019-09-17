import { Column } from "./Column";
export interface IColumnOptions<Type> {
    dataType: DataType;
    primary?: boolean;
    references?: ForeignKey<any>;
    notNull?: boolean;
    unique?: boolean;
    default?: Type;
    converter?: IConverter<Type, any>;
}
export declare class ForeignKey<Type> {
    readonly table: Table<Type>;
    readonly column: keyof Type;
    readonly onDelete?: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE" | undefined;
    readonly onUpdate?: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE" | undefined;
    constructor(table: Table<Type>, column: keyof Type, onDelete?: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE" | undefined, onUpdate?: "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE" | undefined);
}
export declare type DataType = "NULL" | "INTEGER" | "REAL" | "TEXT" | "BLOB";
export declare type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";
export interface IConverter<JSType, DBType> {
    toDB: (input: JSType) => DBType;
    toJS: (input: DBType) => JSType;
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
export declare class Table<Type> {
    readonly tableName: string;
    columns: ColumnOptions<Type>;
    constructor(tableName: string, columns: ColumnOptions<Type>);
}
