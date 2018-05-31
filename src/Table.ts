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
    converter?: IConverter<Type>;
}

export interface IExtendedColumnOptions<Type> extends IColumnOptions<Type> {
    type?: Type;
    columnName?: string;
    tableAlias?: string;
    selected?: boolean;
    aggregation?: AggregationType;
    wrappedBy?: string[];
}

// export interface WrappedColumn<Type>
// {
// 	column: keyof Type;
// 	wrappedBy: string[];
// }

export interface IWrappedColumn {
    column: IExtendedColumnOptions<any>;
    wrappedBy: [string, string];
}

export class ForeignKey<Type> {
    constructor(readonly table: Table<Type>, readonly column: keyof Type, readonly onDelete?: Action, readonly onUpdate?: Action) { }
}

export interface IConverter<Type> {
    toJS: (input: any) => Type;
    toDB: (input: Type) => any;
}

export type MappedTable<Type> = { [K in keyof Type]: IColumnOptions<Type[K]> };
export type ExtendedMappedTable<Type> = { [K in keyof Type]: IExtendedColumnOptions<Type[K]> };

export type DataType = "NULL" | "INTEGER" | "REAL" | "TEXT" | "BLOB";
export type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE";
export type AggregationType = "COUNT" | "SUM" | "AVG" | "MIN" | "MAX";

export class Table<Type> {
    public readonly columns: ExtendedMappedTable<Type>;

    constructor(public readonly tableName: string, columns: MappedTable<Type>) {
        Object.entries(columns as ExtendedMappedTable<any>).forEach(([key, value]) => value.columnName = key);
        this.columns = columns;
    }

    public create() {
        return new CreateQuery(this);
    }

    public drop() {
        return new DropQuery(this);
    }

    public query() {
        return new SelectQuery<Record<"root", Type>>(this, "root");
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
