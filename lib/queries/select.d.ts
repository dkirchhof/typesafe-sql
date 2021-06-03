import { Column } from "../Column";
import { GroupBy } from "../GroupBy";
import { InnerJoinMode, Join, OuterJoinMode } from "../Join";
import { OrderBy, OrderDirection } from "../OrderBy";
import { Predicate, PredicateFactory, PredicateGroup } from "../Predicate";
import { Projection } from "../Projection";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { AliasedSource } from "../Source";
import { Columns, NullableColumns, Table } from "../Table";
interface IResultSet {
    [s: string]: Column<any>;
}
declare type ColumnSelector<RecordType> = (record: RecordType) => Column<any>;
declare type ResultSetFactory<RecordType, ResultSetType extends IResultSet> = (record: RecordType) => ResultSetType;
declare type KeyofKeyof<T> = {
    [K in keyof T]: keyof T[K];
}[keyof T];
declare type Lookup<T, K> = K extends keyof T ? T[K] : never;
declare type Flatten<T> = {
    [K in KeyofKeyof<T>]: {
        [P in keyof T]: Lookup<T[P], K>;
    }[keyof T];
};
export declare function from<Type, Alias extends string = "root">(table: Table<Type>, alias?: Alias): SelectQuery<Record<Alias, Columns<Type>>>;
declare class SelectQuery<RecordType> {
    protected record: any;
    protected source: AliasedSource;
    protected joins: Join[];
    protected wheres: Array<Predicate | PredicateGroup>;
    protected havings: Array<Predicate | PredicateGroup>;
    protected groupBys: GroupBy[];
    protected orderBys: OrderBy[];
    protected isDistinct?: boolean;
    protected limitTo?: number;
    constructor(table: Table<any>, alias: string);
    join<JoinedType, Alias extends string, JoinedRecordType extends RecordType & Record<Alias, Columns<JoinedType>>>(joinMode: InnerJoinMode, table: Table<JoinedType>, alias: Alias, predicateFactory?: PredicateFactory<JoinedRecordType>): SelectQuery<JoinedRecordType>;
    join<JoinedType, Alias extends string, JoinedRecordType extends RecordType & Record<Alias, NullableColumns<JoinedType>>>(joinMode: OuterJoinMode, table: Table<JoinedType>, alias: Alias, predicateFactory?: PredicateFactory<JoinedRecordType>): SelectQuery<JoinedRecordType>;
    where(predicateFactory: PredicateFactory<RecordType>): this;
    having(predicateFactory: PredicateFactory<RecordType>): this;
    groupBy(columnSelector: ColumnSelector<RecordType>): this;
    orderBy(columnSelector: ColumnSelector<RecordType>, direction: OrderDirection): this;
    limit(limit: number): this;
    select<ResultSetType extends IResultSet>(resultSetFactory: ResultSetFactory<RecordType, ResultSetType>): ExecutableSelectQueryWithProjections<{ [K in keyof ResultSetType]: ResultSetType[K] extends Column<infer T> ? T : never; }>;
    selectAll(): ExecutableSelectQueryWithoutProjections<{ [K in keyof Flatten<RecordType>]: Flatten<RecordType>[K] extends Column<infer T> ? T : never; }>;
    private updateRecord;
}
export declare abstract class ExecutableSelectQuery {
    protected source: AliasedSource;
    protected joins: Join[];
    protected wheres: Array<Predicate | PredicateGroup>;
    protected havings: Array<Predicate | PredicateGroup>;
    protected groupBys: GroupBy[];
    protected orderBys: OrderBy[];
    protected isDistinct?: boolean | undefined;
    protected limitTo?: number | undefined;
    constructor(source: AliasedSource, joins: Join[], wheres: Array<Predicate | PredicateGroup>, havings: Array<Predicate | PredicateGroup>, groupBys: GroupBy[], orderBys: OrderBy[], isDistinct?: boolean | undefined, limitTo?: number | undefined);
    toSQL(): string;
    protected abstract selectedColumnsToSQL(): string;
    protected selectToSQL(): string;
    protected sourceToSQL(): string;
    protected joinsToSQL(): string;
    protected distinctToSQL(): "DISTINCT " | "";
    protected wheresToSQL(): string;
    protected havingsToSQL(): string;
    protected groupBysToSQL(): string;
    protected orderBysToSQL(): string;
    protected limitToSQL(): string;
}
export declare class ExecutableSelectQueryWithProjections<ResultType> extends ExecutableSelectQuery {
    private projections;
    constructor(projections: Projection[], source: AliasedSource, joins: Join[], wheres: Array<Predicate | PredicateGroup>, havings: Array<Predicate | PredicateGroup>, groupBys: GroupBy[], orderBys: OrderBy[], isDistinct?: boolean, limitTo?: number);
    execute(databaseProvider: IDatabaseProvider): Promise<ResultType[]>;
    private getColumnOptionsByAlias;
    protected selectedColumnsToSQL(): string;
}
export declare class ExecutableSelectQueryWithoutProjections<ResultType> extends ExecutableSelectQuery {
    execute(databaseProvider: IDatabaseProvider): Promise<ResultType[]>;
    private getAllSources;
    private getAllColumnOptions;
    protected selectedColumnsToSQL(): string;
}
export {};
