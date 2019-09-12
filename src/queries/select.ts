import { Column } from "../Column";
import { GroupBy } from "../GroupBy";
import { Join, JoinMode } from "../Join";
import { OrderBy } from "../OrderBy";
import { Predicate } from "../Predicate";
import { Projection } from "../Projection";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Source } from "../Source";
import { NullableColumns, Table } from "../Table";

interface IResultSet { [s: string]: Column<any>; }

type ColumnSelector<RecordType> = (record: RecordType) => Column<any>;
type PredicateFactory<RecordType> = (record: RecordType) => Predicate<any>;
type ResultSetFactory<RecordType, ResultSetType extends IResultSet> = (record: RecordType) => ResultSetType;

export class SelectQuery<RecordType> {
    protected record: any = { }; // RecordType = { };
    protected source: Source;
    protected joins: Join[] = [];
    protected wheres: Array<Predicate<any>> = [];
    protected havings: Array<Predicate<any>> = [];
    protected groupBys: GroupBy[] = [];
    protected orderBys: OrderBy[] = [];
    protected isDistinct?: boolean;
    protected limitTo?: number;

    constructor(table: Table<any>, alias: string) {
        this.source = new Source(table, alias);
        this.updateRecord(table, alias);
    }

    public join<JoinedType, Alias extends string, JoinedRecordType extends RecordType & Record<Alias, NullableColumns<JoinedType>>>(
        joinMode: JoinMode, table: Table<JoinedType>, alias: Alias, predicateFactory: PredicateFactory<JoinedRecordType>,
    ) {
        this.updateRecord(table, alias);

        const predicate = predicateFactory(this.record);

        this.joins.push(new Join(joinMode, new Source(table, alias), predicate));
        
        return this as any as SelectQuery<JoinedRecordType>;
    }

    public where(predicateFactory: PredicateFactory<RecordType>) {
        const predicate = predicateFactory(this.record);

        this.wheres.push(predicate);

        return this;
    }

    public having(predicateFactory: PredicateFactory<RecordType>) {
        const predicate = predicateFactory(this.record);

        this.havings.push(predicate);

        return this;
    }

    public groupBy(columnSelector: ColumnSelector<RecordType>) {
        const column = columnSelector(this.record);

        this.groupBys.push(new GroupBy(column));

        return this;
    }

    public orderBy(columnSelector: ColumnSelector<RecordType>, direction: "ASC" | "DESC") {
        const column = columnSelector(this.record);

        this.orderBys.push(new OrderBy(column, direction));

        return this;
    }

    public limit(limit: number) {
        this.limitTo = limit;

        return this;
    }

    public select<ResultSetType extends IResultSet>(resultSetFactory: ResultSetFactory<RecordType, ResultSetType>) {
        const resultSetSchema = resultSetFactory(this.record);

        const selectedColumns = Object.entries(resultSetSchema).map(([alias, column]) => new Projection(column, alias));

        return new ExecutableSelectQuery<{ [K in keyof ResultSetType]: ResultSetType[K] extends Column<infer T> ? T : ResultSetType[K]; }>(
            selectedColumns,
            this.source,
            this.joins,
            this.wheres,
            this.havings,
            this.groupBys,
            this.orderBys,
            this.isDistinct,
            this.limitTo,
        );
    }

    private updateRecord(table: Table<any>, alias: string) {
        this.record[alias] =
            Object.keys(table.columns)
                .reduce((prev, column) => ({ ...prev, [column]: new Column(alias, column) }), { });
    }
}

class ExecutableSelectQuery<ResultType> {

    constructor(
        private projections: Projection[],
        private source: Source,
        private joins: Join[],
        private wheres: Array<Predicate<any>>,
        private havings: Array<Predicate<any>>,
        private groupBys: GroupBy[], 
        private orderBys: OrderBy[],
        private isDistinct?: boolean,
        private limitTo?: number,
    ) { }

    public async getOne(databaseProvider: IDatabaseProvider) {
        const result = await this.getMany(databaseProvider);
        return result[0];
    }

    public async getMany(databaseProvider: IDatabaseProvider) {
        const sql = this.toSQL();

        return databaseProvider.get(sql) as Promise<ResultType[]>;
    }

    public toSQL() {
        const sqlParts: string[] = [
            `SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`,
            this.sourceToSQL(),
            this.joinsToSQL(),
            this.wheresToSQL(),
            this.groupBysToSQL(),
            this.havingsToSQL(),
            this.orderBysToSQL(),
            this.limitToSQL(),
        ];

        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
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
        return this.projections.join(", ");
    }

    private wheresToSQL() {
        return this.wheres.length ? `WHERE ${this.wheres.join(" AND ")}` : "";
    }

    private havingsToSQL() {
        return this.havings.length ? `HAVING ${this.havings.join(" AND ")}` : "";
    }

    private groupBysToSQL() {
        return this.groupBys.length ? `GROUP BY ${this.groupBys.join(", ")}` : "";
    }

    private orderBysToSQL() {
        return this.orderBys.length ? `ORDER BY ${this.orderBys.join(", ")}` : "";
    }

    private limitToSQL() {
        return this.limitTo ? `LIMIT ${this.limitTo}` : "";
    }

    // endregion
}
