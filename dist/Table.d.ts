export interface IColumnOptions<Type> {
    dataType: DataType;
    primary?: boolean;
    foreign?: ForeignKey<any>;
    notNull?: boolean;
    unique?: boolean;
    default?: Type;
}
export interface IExtendedColumnOptions<Type> extends IColumnOptions<Type> {
    type?: Type;
    columnName?: string;
    tableAlias?: string;
    selected?: boolean;
    aggregation?: AggregationType;
}
export declare class ForeignKey<Type> {
    readonly table: Table<Type>;
    readonly column: keyof Type;
    readonly onDelete: Action;
    readonly onUpdate: Action;
    constructor(table: Table<Type>, column: keyof Type, onDelete?: Action, onUpdate?: Action);
}
export declare type MappedTable<Type> = {
    [K in keyof Type]: IColumnOptions<Type[K]>;
};
export declare type ExtendedMappedTable<Type> = {
    [K in keyof Type]: IExtendedColumnOptions<Type[K]>;
};
export declare type DataType = "TEXT" | "INT";
export declare type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";
export declare type AggregationType = "COUNT" | "SUM" | "AVG";
export declare class Table<Type> {
    readonly tableName: string;
    readonly columns: ExtendedMappedTable<Type>;
    constructor(tableName: string, columns: MappedTable<Type>);
}
