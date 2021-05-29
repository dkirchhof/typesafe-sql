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
    select<ResultSetType extends IResultSet>(resultSetFactory: ResultSetFactory<RecordType, ResultSetType>): ExecutableSelectQuery<{ [K in keyof ResultSetType]: ResultSetType[K] extends Column<infer T> ? T : ResultSetType[K]; }>;
    private updateRecord;
}
export declare class ExecutableSelectQuery<ResultType> {
    private projections;
    private source;
    private joins;
    private wheres;
    private havings;
    private groupBys;
    private orderBys;
    private isDistinct?;
    private limitTo?;
    constructor(projections: Projection[], source: AliasedSource, joins: Join[], wheres: Array<Predicate | PredicateGroup>, havings: Array<Predicate | PredicateGroup>, groupBys: GroupBy[], orderBys: OrderBy[], isDistinct?: boolean | undefined, limitTo?: number | undefined);
    execute(databaseProvider: IDatabaseProvider): Promise<ResultType[]>;
    toSQL(): string;
    private getColumnOptionsByAlias;
    private selectToSQL;
    private sourceToSQL;
    private joinsToSQL;
    private distinctToSQL;
    private selectedColumnsToSQL;
    private wheresToSQL;
    private havingsToSQL;
    private groupBysToSQL;
    private orderBysToSQL;
    private limitToSQL;
}
export {};
