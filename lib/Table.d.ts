import { Column } from "./Column";
export interface IColumnOptions<Type> {
    dataType: DataType;
    nullable?: boolean;
    unique?: boolean;
    default?: Type;
    converter?: IConverter<Type, any>;
}
export declare abstract class KeyConstraint<Type> {
    protected readonly myColumns: Array<keyof Type>;
    constructor(columns: keyof Type | Array<keyof Type>);
}
export declare class PrimaryKey<Type> extends KeyConstraint<Type> {
    toString(): string;
}
export declare class ForeignKey<MyType, ReferencedType> extends KeyConstraint<MyType> {
    private readonly onDelete;
    private readonly onUpdate;
    private readonly referencedTable;
    private readonly referencedColumns;
    constructor(myColumns: keyof MyType | Array<keyof MyType>, tableSelector: Table<ReferencedType>, referencedColumns: keyof ReferencedType | Array<keyof ReferencedType>, onDelete?: Action, onUpdate?: Action);
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
    constraints: Array<PrimaryKey<Type> | ForeignKey<Type, any>>;
    constructor(tableName: string, columns: ColumnOptions<Type>, constraints?: Array<PrimaryKey<Type> | ForeignKey<Type, any>>);
}
