import { AliasedColumn, Column } from "../Column";
import { GroupBy } from "../GroupBy";
import { InnerJoinMode, Join, OuterJoinMode } from "../Join";
import { OrderBy, OrderDirection } from "../OrderBy";
import { Predicate, PredicateFactory, PredicateGroup } from "../Predicate";
import { Projection } from "../Projection";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { AliasedSource } from "../Source";
import { ColumnOptions, Columns, NullableColumns, Table } from "../Table";

interface IResultSet { [s: string]: Column<any>; }

type ColumnSelector<RecordType> = (record: RecordType) => Column<any>;
type ResultSetFactory<RecordType, ResultSetType extends IResultSet> = (record: RecordType) => ResultSetType;

type KeyofKeyof<T> = { [K in keyof T]: keyof T[K] }[keyof T]
type Lookup<T, K> = K extends keyof T ? T[K] : never 
type Flatten<T> = { [K in KeyofKeyof<T>]: { [P in keyof T]: Lookup<T[P], K> }[keyof T] } 

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
    
    public join<JoinedType, Alias extends string, JoinedRecordType extends RecordType & Record<Alias, Columns<JoinedType>>>(
        joinMode: InnerJoinMode, table: Table<JoinedType>, alias: Alias, predicateFactory?: PredicateFactory<JoinedRecordType>,
    ): SelectQuery<JoinedRecordType>

    public join<JoinedType, Alias extends string, JoinedRecordType extends RecordType & Record<Alias, NullableColumns<JoinedType>>>(
        joinMode: OuterJoinMode, table: Table<JoinedType>, alias: Alias, predicateFactory?: PredicateFactory<JoinedRecordType>,
    ): SelectQuery<JoinedRecordType>

    public join(
        joinMode: InnerJoinMode | OuterJoinMode, table: Table<any>, alias: string, predicateFactory?: PredicateFactory<any>,
    ) {
        this.updateRecord(table, alias);

        const predicate = predicateFactory ? predicateFactory(this.record) : null;

        this.joins.push(new Join(joinMode, new AliasedSource(table, alias), predicate));
        
        return this;
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

        return new ExecutableSelectQueryWithProjections<{ [K in keyof ResultSetType]: ResultSetType[K] extends Column<infer T> ? T : never; }>(
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

    public selectAll() {
        type ResultSetType = Flatten<RecordType>;

        return new ExecutableSelectQueryWithoutProjections<{ [K in keyof ResultSetType]: ResultSetType[K] extends Column<infer T> ? T : never; }>(
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

export abstract class ExecutableSelectQuery {

    constructor(
        protected source: AliasedSource,
        protected joins: Join[],
        protected wheres: Array<Predicate | PredicateGroup>,
        protected havings: Array<Predicate | PredicateGroup>,
        protected groupBys: GroupBy[], 
        protected orderBys: OrderBy[],
        protected isDistinct?: boolean,
        protected limitTo?: number,
    ) { }

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
    
    // region string methods
    
    protected abstract selectedColumnsToSQL(): string;

    protected selectToSQL() {
        return `SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`;
    }

    protected sourceToSQL() {
        return `FROM ${this.source}`;
    }

    protected joinsToSQL() {
        return this.joins.join("\n  ");
    }

    protected distinctToSQL() {
        return this.isDistinct ? "DISTINCT " : "";
    }

    protected wheresToSQL() {
        return this.wheres.length ? `WHERE ${this.wheres.join(" AND ")}` : "";
    }

    protected havingsToSQL() {
        return this.havings.length ? `HAVING ${this.havings.join(" AND ")}` : "";
    }

    protected groupBysToSQL() {
        return this.groupBys.length ? `GROUP BY ${this.groupBys.join(", ")}` : "";
    }

    protected orderBysToSQL() {
        return this.orderBys.length ? `ORDER BY ${this.orderBys.join(", ")}` : "";
    }

    protected limitToSQL() {
        return this.limitTo ? `LIMIT ${this.limitTo}` : "";
    }

    // endregion
}

export class ExecutableSelectQueryWithProjections<ResultType> extends ExecutableSelectQuery {
    constructor(
         private projections: Projection[],
         source: AliasedSource,
         joins: Join[],
         wheres: Array<Predicate | PredicateGroup>,
         havings: Array<Predicate | PredicateGroup>,
         groupBys: GroupBy[], 
         orderBys: OrderBy[],
         isDistinct?: boolean,
         limitTo?: number,
    ) {
        super(source, joins, wheres, havings, groupBys, orderBys, isDistinct, limitTo);
    }

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

    private getColumnOptionsByAlias(alias: string) {
        return this.projections.find(p => p.alias === alias)!.column.options;
    }

    protected selectedColumnsToSQL() {
        return this.projections.join(", ");
    }
}

export class ExecutableSelectQueryWithoutProjections<ResultType> extends ExecutableSelectQuery {
    public async execute(databaseProvider: IDatabaseProvider) {
        const sql = this.toSQL();
        const rawTuples = await databaseProvider.get(sql) as any[];
        
        const allColumnOptions = this.getAllColumnOptions();

        return rawTuples.map(tuple => 
            Object.entries(tuple).reduce((jsTuple, [columnName, value]) => {
                const { converter } = allColumnOptions[columnName];

                return {
                    ...jsTuple,
                    [columnName]: converter ? converter.toJS(value) : value,
                };

            }, { } as ResultType),
        );
    }
    
    private getAllSources() {
        return [this.source].concat(this.joins.map(join => join.source));
    }

    private getAllColumnOptions() {
        return this.getAllSources()
            .reduce((columns, source) => ({ ...columns, ...source.table.columns }), {} as ColumnOptions<any>);
    }

    protected selectedColumnsToSQL() {
        return "*";
    }
}
