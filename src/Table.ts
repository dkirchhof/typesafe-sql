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

export class ForeignKey<Type> {
    private readonly table: Table<Type>;

    constructor(tableSelector: () => Table<Type>, private readonly column: keyof Type, private readonly onDelete: Action = "NO ACTION", private readonly onUpdate: Action = "NO ACTION") { 
        this.table = tableSelector();
    }

    public toString() {
        return `REFERENCES ${this.table.tableName}(${this.column}) ON DELETE ${this.onDelete} ON UPDATE ${this.onUpdate}`;
    }
}

export type DataType = "NULL" | "INTEGER" | "REAL" | "TEXT" | "BLOB";
export type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";

export interface IConverter<JSType, DBType> {
    toDB: (input: JSType) => DBType;
    toJS: (input: DBType) => JSType;
}

export type ColumnOptions<Type> = { [K in keyof Type]: IColumnOptions<Type[K]> };

export type Columns<Type> = { [K in keyof Type]-?: Column<Type[K]>; };
export type NullableColumns<Type> = { [K in keyof Type]-?: Column<Type[K] | null>; };

export class Table<Type> {
    constructor(public readonly tableName: string, public columns: ColumnOptions<Type>) { }
}
