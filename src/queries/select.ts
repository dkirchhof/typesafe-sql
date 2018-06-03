import { Column, FilterColumn, OrderByColumn, ProjectionColumn } from "../Column";
import { Operator } from "../Operator";
import { IColumnOptions, IWrappedColumn, Table } from "../Table";
import { isColumn, isWrappedColum } from "../utils";

type MappedRecord<RecordType> = {
    [AliasKey in keyof RecordType] : {
        [ColumnKey in keyof RecordType[AliasKey]]: IColumnOptions<RecordType[AliasKey][ColumnKey]>;
    };
};

type ColumnSelector<RecordType, ColumnType = any> = (record: MappedRecord<RecordType>) => IColumnOptions<ColumnType> | IWrappedColumn<ColumnType>;

class Source {
    constructor(private table: Table<any>, private alias: string) { }

    public toString() {
        return `${this.table.tableName} AS ${this.alias}`;
    }
}

export class SelectQuery<RecordType, ResultType = null> {
    protected record: any = {}; // MappedRecord<RecordType>;
    protected resultSetMapper: (record: RecordType) => any;

    protected sources: Source[] = [];
    protected selectedColumns: ProjectionColumn[] = [];
    protected filterColumns: FilterColumn[] = [];
    protected groupByColumns: Column[] = [];
    protected orderByColumns: OrderByColumn[] = [];
    protected isDistinct: boolean;
    protected limitTo: number;

    constructor(table: Table<any>, alias: string) {
        this.addSource(table, alias);
    }

    public where<ColumnType>(selector: ColumnSelector<RecordType, ColumnType>, operator: Operator = "=", valueOrColumnSelector: ColumnType /*| mappedRecordsPredicate<T>*/) {
        const column = selector(this.record);

        if (isColumn(column)) {
            this.filterColumns.push(new FilterColumn(column, operator, valueOrColumnSelector));
        } else if (isWrappedColum(column)) {
            this.filterColumns.push(new FilterColumn(column.column, operator, valueOrColumnSelector, column.wrappedBy));
        }

        // if (typeof valueOrColumnSelector === "function") {
        //     this.filters.push({ column, valueOrColumn: valueOrColumnSelector(this.record), operator });
        // } else {
        // this.filters.push({ column, operator, valueOrColumn: valueOrColumnSelector });
        // }

        return this;
    }

    public groupBy(selector: ColumnSelector<RecordType>) {
        const column = selector(this.record);

        if (isColumn(column)) {
            this.groupByColumns.push(new Column(column));
        } else if (isWrappedColum(column)) {
            this.groupByColumns.push(new Column(column.column, column.wrappedBy));
        }

        return this;
    }

    public orderBy(selector: ColumnSelector<RecordType>, direction: "ASC" | "DESC" = "ASC") {
        const column = selector(this.record);

        if (isColumn(column)) {
            this.orderByColumns.push(new OrderByColumn(column, direction));
        } else if (isWrappedColum(column)) {
            this.orderByColumns.push(new OrderByColumn(column.column, direction, column.wrappedBy));
        }

        return this;
    }

    public limit(limit: number) {
        this.limitTo = limit;
        return this;
    }

    public join<JoinedType, Alias extends string>(table: Table<JoinedType>, alias: Alias) {
        this.addSource(table, alias);
        return (this as any) as SelectQuery<RecordType & Record<Alias, JoinedType>>;
    }

    public select<Type>(mapper: (record: RecordType) => Type) {
        const resultSetSchema = mapper(this.record);

        this.resultSetMapper = mapper;
        this.selectedColumns = this.getSelectedColumns(resultSetSchema);

        return new ExecutableSelectQuery<RecordType, ResultType>(
            this.record,
            this.resultSetMapper,
            this.sources,
            this.selectedColumns,
            this.filterColumns,
            this.groupByColumns,
            this.orderByColumns,
            this.isDistinct,
            this.limitTo,
        );
    }

    public selectAll() {
        // to select all, the mapper just takes the record and returns it, as it is
        return this.select(r => r);
    }

    private addSource(table: Table<any>, alias: string) {
        this.sources.push(new Source(table, alias));
        this.record[alias] =
            Object.entries(table.columns)
                .reduce((prev, [key, value]) => ({ ...prev, [key]: { ...value, tableAlias: alias } }), { });
    }

    private getSelectedColumns(resultSetSchema: any, columns: ProjectionColumn[] = [], path = "") {

        Object.entries(resultSetSchema).forEach(([key, value]) => {
            if (isColumn(value)) {
                columns.push(new ProjectionColumn(value, `${path}${key}`));
            } else if (isWrappedColum(value)) {
                columns.push(new ProjectionColumn(value.column, `${path}${key}`, value.wrappedBy));
            } else if (typeof value === "object") {
                this.getSelectedColumns(value, columns, `${path}${key}_`);
            }
        });

        return columns;
    }
}

class ExecutableSelectQuery<RecordType, ResultType> {

    constructor(
        private record: any,
        private resultSetMapper: (record: RecordType) => any,
        private sources: Source[],
        private selectedColumns: ProjectionColumn[],
        private filterColumns: FilterColumn[],
        private groupByColumns: Column[],
        private orderByColumns: OrderByColumn[],
        private isDistinct: boolean,
        private limitTo: number,
    ) { }

    public getOne() {
        const resultSetSchema = this.resultSetMapper(this.record);
        const result = { min: 1, max: 1384 };

        this.fillResultSet(resultSetSchema, result);

        return resultSetSchema as ResultType;
    }

    public getMany() {
        return {} as ResultType[];
    }

    public toSQL() {
        const sqlParts: string[] = [
            `SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`,
            this.sourcesToSQL(),
            this.filtersToSQL(),
            this.groupByToSQL(),
            this.orderByToSQL(),
            this.limitToSQL(),
        ];

        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
    }

    private fillResultSet(resultSetSchema: any, result: any) {
        Object.entries(resultSetSchema).forEach(([key, value]) => {
            if (isColumn(value) || isWrappedColum(value)) {
                resultSetSchema[key] = result[key];
            } else if (typeof value === "object") {
                this.fillResultSet(value, result);
            }
        });
    }

    // region string methods

    private sourcesToSQL() {
        return `FROM ${this.sources.join(", ")}`;
    }

    private distinctToSQL() {
        return this.isDistinct ? "DISTINCT " : "";
    }

    private selectedColumnsToSQL() {
        return this.selectedColumns.join(", ");
    }

    private filtersToSQL() {
        return this.filterColumns.length ? `WHERE ${this.filterColumns.join(" AND ")}` : "";
    }

    private groupByToSQL() {
        return this.groupByColumns.length ? `GROUP BY ${this.groupByColumns.join(", ")}` : "";
    }

    private orderByToSQL() {
        return this.orderByColumns.length ? `ORDER BY ${this.orderByColumns.join(", ")}` : "";
    }

    private limitToSQL() {
        return this.limitTo ? `LIMIT ${this.limitTo}` : "";
    }

    // endregion
}

export function wrap<T>(strings: TemplateStringsArray, column: any): IWrappedColumn<T> {
    return { column, wrappedBy: [strings[0], strings[1]] };
}
