import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { AliasedTable } from "../Table";
export declare type AggregationType = "COUNT" | "SUM" | "AVG";
export declare type Attribute = {
    tableName: string;
    attributeName: string;
    aggregation?: AggregationType;
};
export declare function select<Type1, Alias1 extends string, Key1 extends keyof Type1>(aliasedTable1: AliasedTable<Type1, Alias1>, attributes1: Key1[]): Query<Pick<Type1, Key1>, Alias1, any, any, any, any, any, any>;
export declare function select<Type1, Alias1 extends string, Key1 extends keyof Type1, Type2, Alias2 extends string, Key2 extends keyof Type2>(aliasedTable1: AliasedTable<Type1, Alias1>, attributes1: Key1[], aliasedTable2: AliasedTable<Type2, Alias2>, attributes2: Key2[]): Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, any, any, any, any>;
export declare function select<Type1, Alias1 extends string, Key1 extends keyof Type1, Type2, Alias2 extends string, Key2 extends keyof Type2, Type3, Alias3 extends string, Key3 extends keyof Type3>(aliasedTable1: AliasedTable<Type1, Alias1>, attributes1: Key1[], aliasedTable2: AliasedTable<Type2, Alias2>, attributes2: Key2[], aliasedTable3: AliasedTable<Type3, Alias3>, attributes3: Key3[]): Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, Pick<Type3, Key3>, Alias3, any, any>;
export declare function select<Type1, Alias1 extends string, Key1 extends keyof Type1, Type2, Alias2 extends string, Key2 extends keyof Type2, Type3, Alias3 extends string, Key3 extends keyof Type3, Type4, Alias4 extends string, Key4 extends keyof Type4>(aliasedTable1: AliasedTable<Type1, Alias1>, attributes1: Key1[], aliasedTable2: AliasedTable<Type2, Alias2>, attributes2: Key2[], aliasedTable3: AliasedTable<Type3, Alias3>, attributes3: Key3[], aliasedTable4: AliasedTable<Type4, Alias4>, attributes4: Key4[]): Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, Pick<Type3, Key3>, Alias3, Pick<Type4, Key4>, Alias4>;
export declare class Query<Type1, Alias1 extends string, Type2, Alias2 extends string, Type3, Alias3 extends string, Type4, Alias4 extends string> {
    private aliasedTables;
    private attributes;
    private filters;
    private groupByParams;
    private orderParams;
    private limitParam;
    constructor(aliasedTables: AliasedTable<any, any>[], attributes: Attribute[]);
    aggregate<Type, Alias extends string, Key extends keyof Type>(table: AliasedTable<Type, Alias>, column: Key, aggregationType: AggregationType): this;
    where<TypeA, AliasA extends string, Key extends keyof TypeA>(table: AliasedTable<TypeA, AliasA>, column: Key, value: TypeA[Key]): this;
    joinOn<TypeA extends Type1, AliasA extends string, KeyA extends keyof TypeA, TypeB, AliasB extends string, KeyB extends keyof TypeB>(aliasedTable1: AliasedTable<TypeA, AliasA>, key1: KeyA, aliasedTable2: AliasedTable<TypeB, AliasB>, key2: KeyB): this;
    groupBy<Type, Alias extends string, Key extends keyof Type>(table: AliasedTable<Type, Alias>, column: Key): this;
    orderBy<Type, Alias extends string, Key extends keyof Type>(table: AliasedTable<Type, Alias>, column: Key, direction?: "ASC" | "DESC"): this;
    limit(limit: number): this;
    execute(databaseProvider: IDatabaseProvider): Promise<(Record<Alias1, Type1> & Record<Alias2, Type2> & Record<Alias3, Type3> & Record<Alias4, Type4>)[]>;
    toSQL(): string;
}
