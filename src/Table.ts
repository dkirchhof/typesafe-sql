import { Column } from "./Column";

export interface IColumnOptions<Type> {
    dataType: DataType;
    primary?: boolean;
    references?: ForeignKey<any>;
    notNull?: boolean;
    unique?: boolean;
    default?: Type;
}

export class ForeignKey<Type> {
    constructor(readonly table: Table<Type>, readonly column: keyof Type, readonly onDelete?: Action, readonly onUpdate?: Action) { }
}

export type DataType = "NULL" | "INTEGER" | "REAL" | "TEXT" | "BLOB";
export type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";

export type ColumnOptions<Type> = { [K in keyof Type]: IColumnOptions<Type[K]> };

export type Columns<Type> = { [K in keyof Type]-?: Column<Type[K]>; };
export type NullableColumns<Type> = { [K in keyof Type]-?: Column<Type[K] | null>; };

export class Table<Type> {
    constructor(public readonly tableName: string, public columns: ColumnOptions<Type>) { }
}
