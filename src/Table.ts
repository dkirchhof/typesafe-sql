import { Column } from "./Column";
import { toArray } from "./utils";

export interface IColumnOptions<Type> {
    dataType: DataType;
    nullable?: boolean;
    unique?: boolean;
    default?: Type;
    converter?: IConverter<Type, any>;
}

export abstract class KeyConstraint<Type> {
    protected readonly myColumns: Array<keyof Type>;

    constructor(columns: keyof Type | Array<keyof Type>) { 
        this.myColumns = toArray(columns);
    }
}

export class PrimaryKey<Type> extends KeyConstraint<Type> {
    public toString() {
        return `PRIMARY KEY (${this.myColumns.join(", ")})`;
    }
}

export class ForeignKey<MyType, ReferencedType> extends KeyConstraint<MyType> {
    private readonly referencedTable: Table<ReferencedType>;
    private readonly referencedColumns: Array<keyof ReferencedType>;
    
    constructor(myColumns: keyof MyType | Array<keyof MyType>, tableSelector: Table<ReferencedType>, referencedColumns: keyof ReferencedType | Array<keyof ReferencedType>, private readonly onDelete: Action = "NO ACTION", private readonly onUpdate: Action = "NO ACTION") { 
        super(myColumns);

        this.referencedTable = tableSelector;//();
        this.referencedColumns = toArray(referencedColumns);
    }

    public toString() {
        return `FOREIGN KEY (${this.myColumns.join(", ")}) REFERENCES ${this.referencedTable.tableName}(${this.referencedColumns.join(", ")}) ON DELETE ${this.onDelete} ON UPDATE ${this.onUpdate}`;
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
    constructor(public readonly tableName: string, public columns: ColumnOptions<Type>, public constraints: Array<PrimaryKey<Type> | ForeignKey<Type, any>> = []) { }
}
