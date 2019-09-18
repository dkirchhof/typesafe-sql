import { AliasedColumn, Column } from "../Column";
import { GroupBy } from "../GroupBy";
import { Join, JoinMode } from "../Join";
import { OrderBy, OrderDirection } from "../OrderBy";
import { Predicate, PredicateFactory, PredicateGroup } from "../Predicate";
import { Projection } from "../Projection";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { AliasedSource } from "../Source";
import { Columns, NullableColumns, Table } from "../Table";

interface IResultSet { [s: string]: Column<any>; }

type ColumnSelector<RecordType> = (record: RecordType) => Column<any>;
type ResultSetFactory<RecordType, ResultSetType extends IResultSet> = (record: RecordType) => ResultSetType;

export function from<Type, Alias extends string = "root">(table: Table<Type>, alias?: Alias) {
    return new SelectQuery<Record<Alias, Columns<Type>>>(table, alias || "root");
}

class SelectQuery<RecordType> {
    protected record: any = { }; // RecordType = { };
    protected source: AliasedSource;
    protected joins: Join[] = [];
    protected wheres: Array<Predicate | PredicateGroup> = [];
    protected havings: Array<Predicate | PredicateGroup> = [];
    protected groupBys: GroupBy[] = [];
    protected orderBys: OrderBy[] = [];
    protected isDistinct?: boolean;
    protected limitTo?: number;

    constructor(table: Table<any>, alias: string) {
        this.source = new AliasedSource(table, alias);

        this.updateRecord(table, alias);
    }

    public join<JoinedType, Alias extends string, JoinedRecordType extends RecordType & Record<Alias, NullableColumns<JoinedType>>>(
        joinMode: JoinMode, table: Table<JoinedType>, alias: Alias, predicateFactory?: PredicateFactory<JoinedRecordType>,
    ) {
        this.updateRecord(table, alias);

        const predicate = predicateFactory ? predicateFactory(this.record) : null;

        this.joins.push(new Join(joinMode, new AliasedSource(table, alias), predicate));
        
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

    public orderBy(columnSelector: ColumnSelector<RecordType>, direction: OrderDirection) {
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
            Object.entries(table.columns)
                .reduce((prev, [columnName, columnOptions]) => ({ ...prev, [columnName]: new AliasedColumn(alias, columnName, columnOptions) }), { });
    }
}

class ExecutableSelectQuery<ResultType> {

    constructor(
        private projections: Projection[],
        private source: AliasedSource,
        private joins: Join[],
        private wheres: Array<Predicate | PredicateGroup>,
        private havings: Array<Predicate | PredicateGroup>,
        private groupBys: GroupBy[], 
        private orderBys: OrderBy[],
        private isDistinct?: boolean,
        private limitTo?: number,
    ) { }

    public async execute(databaseProvider: IDatabaseProvider) {
        const sql = this.toSQL();
        const rawTuples = await databaseProvider.get(sql) as any[];

        return rawTuples.map(tuple => 
            Object.entries(tuple).reduce((jsTuple, [alias, value]) => {
                const { converter } = this.getColumnOptionsByAlias(alias);

                return {
                    ...jsTuple,
                    [alias]: converter ? converter.toJS(value) : value,
                };

            }, { } as ResultType),
        );
    }

    public toSQL() {
        const sqlParts: string[] = [
            this.selectToSQL(),
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

    private getColumnOptionsByAlias(alias: string) {
        return this.projections.find(p => p.alias === alias)!.column.options;
    }

    // region string methods

    private selectToSQL() {
        return `SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`;
    }

    private sourceToSQL() {
        return `FROM ${this.source}`;
    }

    private joinsToSQL() {
        return this.joins.join("\n  ");
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
