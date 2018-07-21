import { Column, FilterColumn, OrderByColumn, ProjectionColumn } from "../Column";
import { JoinMode } from "../JoinMode";
import { Operator } from "../Operator";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
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

class Join {
    constructor(private joinMode: JoinMode, private source: Source, private leftColumn: Column, private operator: Operator, private rightColumn: Column) { }

    public toString() {
        return `${this.joinMode} JOIN ${this.source} ON ${this.leftColumn} ${this.operator} ${this.rightColumn}`;
    }
}

export class SelectQuery<RecordType> {
    protected record: any = {}; // MappedRecord<RecordType>;
    protected resultSetMapper: (record: RecordType) => any;

    protected source: Source;
    protected joins: Join[] = [];
    protected selectedColumns: ProjectionColumn[] = [];
    protected filterColumns: FilterColumn[] = [];
    protected groupByColumns: Column[] = [];
    protected orderByColumns: OrderByColumn[] = [];
    protected isDistinct: boolean;
    protected limitTo: number;

    constructor(table: Table<any>, alias: string) {
        this.source = new Source(table, alias);
        this.updateRecord(table, alias);
    }

    public join<JoinedType, Alias extends string>(joinMode: JoinMode, table: Table<JoinedType>, alias: Alias, leftSelector: ColumnSelector<RecordType>, operator: Operator, rightSelector: ColumnSelector<RecordType & Record<Alias, JoinedType>>) {
        this.updateRecord(table, alias);

        const getColumn = (selector: ColumnSelector<RecordType>) => {
            const selected = selector(this.record);

            if (isColumn(selected)) {
                return new Column(selected);
            } else if (isWrappedColum(selected)) {
                return new Column(selected.column, selected.wrappedBy);
            }
        };

        const leftColumn = getColumn(leftSelector)!;
        const rightColumn = getColumn(rightSelector)!;

        this.joins.push(new Join(joinMode, new Source(table, alias), leftColumn, operator, rightColumn));
        return (this as any) as SelectQuery<RecordType & Record<Alias, JoinedType>>;
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

    public select<ResultType>(mapper: (record: RecordType) => ResultType) {
        const resultSetSchema = mapper(this.record);

        this.resultSetMapper = mapper;
        this.selectedColumns = this.getSelectedColumns(resultSetSchema);

        return new ExecutableSelectQuery<RecordType, ResultType>(
            this.record,
            this.resultSetMapper,
            this.source,
            this.joins,
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

    private updateRecord(table: Table<any>, alias: string) {
        // copy each column of the table
        // add tableAlias property to the column
        // add a copy of whole columns object to the record
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
        private source: Source,
        private joins: Join[],
        private selectedColumns: ProjectionColumn[],
        private filterColumns: FilterColumn[],
        private groupByColumns: Column[],
        private orderByColumns: OrderByColumn[],
        private isDistinct: boolean,
        private limitTo: number,
    ) { }

    public async getOne(databaseProvider: IDatabaseProvider) {
        const result = await this.getMany(databaseProvider);
        return result[0];
    }

    public async getMany(databaseProvider: IDatabaseProvider) {
        const resultSetSchema = this.resultSetMapper(this.record);
        const sql = this.toSQL();

        console.log(sql);

        const result = await databaseProvider.get(sql);

        return result.map(record => {
            const schemaCopy = JSON.parse(JSON.stringify(resultSetSchema));
            this.fillResultSet(schemaCopy, record);
            
            return schemaCopy;
            
        }) as ResultType[];
    }

    public toSQL() {
        const sqlParts: string[] = [
            `SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`,
            this.sourceToSQL(),
            this.joinsToSQL(),
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

    private fillResultSet(resultSetSchema: any, record: any, path = "") {
        
        // Object.entries(resultSetSchema).forEach(([key, value]) => {
        //     if (isColumn(value)) {
        //         resultSetSchema[key] = record[`${path}${key}`];
        //     } else if (isWrappedColum(value)) {
        //         resultSetSchema[key] = record[`${value.column.tableAlias}_${value.column.columnName}`];
        //     } else if (typeof value === "object") {
        //         this.fillResultSet(value, record);
        //     }
        // });

        Object.entries(resultSetSchema).forEach(([key, value]) => {
            if (isColumn(value) || isWrappedColum(value)) {
                resultSetSchema[key] = record[`${path}${key}`];
            } else if (typeof value === "object") {
                this.fillResultSet(value, record, `${path}${key}_`);
            }
        });
    }

    // region string methods

    private sourceToSQL() {
        return `FROM ${this.source}`;
    }

    private joinsToSQL() {
        return this.joins.join("\n");
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
