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
    private readonly column;
    private readonly onDelete;
    private readonly onUpdate;
    private readonly table;
    constructor(tableSelector: () => Table<Type>, column: keyof Type, onDelete?: Action, onUpdate?: Action);
    toString(): string;
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
