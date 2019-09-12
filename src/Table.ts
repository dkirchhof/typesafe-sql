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

export class ForeignKey<Type> {
    constructor(readonly table: Table<Type>, readonly column: keyof Type, readonly onDelete?: Action, readonly onUpdate?: Action) { }
}

export type ColumnOptions<Type> = { [K in keyof Type]: IColumnOptions<Type[K]> };
export type Columns<Type> = { [K in keyof Type]-?: Column<Type[K]>; };
export type NullableColumns<Type> = { [K in keyof Type]-?: Column<Type[K] | null>; };

export type DataType = "NULL" | "INTEGER" | "REAL" | "TEXT" | "BLOB";
export type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";
export type AggregationType = "COUNT" | "SUM" | "AVG" | "MIN" | "MAX";

export class Table<Type> {
    // public readonly columns: ColumnOptions<Type>;

    constructor(public readonly tableName: string, public columns: ColumnOptions<Type>) {
        // Object.entries(columns as ExtendedMappedTable<any>).forEach(([key, value]) => value.columnName = key);
        // this.columns = columns;
    }

    public create() {
        return new CreateQuery(this);
    }

    public drop() {
        return new DropQuery(this);
    }

    public query<Alias extends string>(alias: Alias) {
        return new SelectQuery<Record<Alias, Columns<Type>>>(this, alias);
    }

    public insert(tuples: Type | Type[]) {
        return new InsertQuery<Type>(this, tuples);
    }

    public update(values: Partial<Type>) {
        return new UpdateQuery<Type>(this, values);
    }

    public delete() {
        return new DeleteQuery<Type>(this);
    }
}
