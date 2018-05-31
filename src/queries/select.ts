import { Column, OrderByColumn, ProjectionColumn } from "../Column";
import { IColumnOptions, Table, WrappedColumn } from "../Table";
import { isColumn, isWrappedColum } from "../utils";

type MappedRecord<RecordType> = {
    [Key in keyof RecordType] : {
        [SubKey in keyof RecordType[Key]]: IColumnOptions<any>;
    };
};

type ColumnSelector<RecordType> = (record: MappedRecord<RecordType>) => IColumnOptions<any>;

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
    protected isDistinct: boolean;
    protected groupByColumns: Column[] = [];
    protected orderByColumns: OrderByColumn[] = [];
    protected limitTo: number;

    constructor(table: Table<any>, alias: string) {
        this.addSource(table, alias);
    }

    public groupBy(selector: ColumnSelector<RecordType>) {
        const column = selector(this.record);
        this.groupByColumns.push(new Column(column));

        return this;
    }

    public orderBy(selector: ColumnSelector<RecordType>, direction: "ASC" | "DESC" = "ASC") {
        const column = selector(this.record);
        this.orderByColumns.push(new OrderByColumn(column, direction));

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

    public select<Type extends object>(mapper: (record: RecordType) => Type) {
        const resultSetSchema = mapper(this.record);

        this.resultSetMapper = mapper;
        this.selectedColumns = this.getSelectedColumns(resultSetSchema);

        return new ExecutableSelectQuery<RecordType, ResultType>(
            this.record,
            this.resultSetMapper,
            this.sources,
            this.selectedColumns,
            this.isDistinct,
            this.groupByColumns,
            this.orderByColumns,
            this.limitTo,
        );
    }

    private addSource(table: Table<any>, alias: string) {
        this.sources.push(new Source(table, alias));
        this.record[alias] =
            Object.entries(table.columns)
                .reduce((prev, [key, value]) => ({ ...prev, [key]: { ...value, tableAlias: alias } }), { });
    }

    private getSelectedColumns(resultSetSchema: object, columns: ProjectionColumn[] = [], path = "") {

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
        private isDistinct: boolean,
        private groupByColumns: Column[],
        private orderByColumns: OrderByColumn[],
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
            // this.filtersToSQL(),
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

export function wrap<T>(strings: TemplateStringsArray, column: any): WrappedColumn {
    return { column, wrappedBy: [strings[0], strings[1]] };
}

const personTable = new Table<{ id: number; firstname: string; lastname: string; }>("persons", {
    firstname: { dataType: "TEXT" },
    id: { dataType: "INTEGER", primary: true },
    lastname: { dataType: "TEXT" },
});
