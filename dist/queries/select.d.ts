import { Table, ExtendedMappedTable, IExtendedColumnOptions, AggregationType } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
export declare function from<Type1, Alias1 extends string, Type2, Alias2 extends string>(table1: Table<Type1>, alias1: Alias1, table2?: Table<Type2>, alias2?: Alias2): {
    _sources: {
        tableName: string;
        tableAlias: string;
        columns: ExtendedMappedTable<any>;
    }[];
    _filters: {
        column: IExtendedColumnOptions<any>;
        value: any;
    }[];
    _joinFilters: {
        column1: IExtendedColumnOptions<any>;
        column2: IExtendedColumnOptions<any>;
    }[];
    _groupByColumns: {
        column: IExtendedColumnOptions<any>;
    }[];
    _orderByColumns: {
        column: IExtendedColumnOptions<any>;
        direction: "ASC" | "DESC";
    }[];
    _limitTo: number;
    _record: Record<Alias1, ExtendedMappedTable<Type1>> & Record<Alias2, ExtendedMappedTable<Type2>>;
    _createSources(sources: IArguments): {
        tableName: string;
        tableAlias: string;
        columns: ExtendedMappedTable<any>;
    }[];
    _createRecord(sources: {
        tableName: string;
        tableAlias: string;
        columns: ExtendedMappedTable<any>;
    }[]): any;
    aggregate(columnSelector: (tables: Record<Alias1, ExtendedMappedTable<Type1>> & Record<Alias2, ExtendedMappedTable<Type2>>) => IExtendedColumnOptions<any>, aggregationType: AggregationType): any;
    where<T>(columnSelector: (tables: Record<Alias1, ExtendedMappedTable<Type1>> & Record<Alias2, ExtendedMappedTable<Type2>>) => IExtendedColumnOptions<T>, value: T): any;
    joinOn<T>(columnSelector1: (tables: Record<Alias1, ExtendedMappedTable<Type1>> & Record<Alias2, ExtendedMappedTable<Type2>>) => IExtendedColumnOptions<T>, columnSelector2: (tables: Record<Alias1, ExtendedMappedTable<Type1>> & Record<Alias2, ExtendedMappedTable<Type2>>) => IExtendedColumnOptions<T>): any;
    groupBy(columnSelector: (tables: Record<Alias1, ExtendedMappedTable<Type1>> & Record<Alias2, ExtendedMappedTable<Type2>>) => IExtendedColumnOptions<any>): any;
    orderBy(columnSelector: (tables: Record<Alias1, ExtendedMappedTable<Type1>> & Record<Alias2, ExtendedMappedTable<Type2>>) => IExtendedColumnOptions<any>, direction?: "ASC" | "DESC"): any;
    limit(limit: number): any;
    select(keys1: (keyof Type1)[], keys2?: (keyof Type2)[] | undefined): {
        _sources: {
            tableName: string;
            tableAlias: string;
            columns: ExtendedMappedTable<any>;
        }[];
        _filters: {
            column: IExtendedColumnOptions<any>;
            value: any;
        }[];
        _joinFilters: {
            column1: IExtendedColumnOptions<any>;
            column2: IExtendedColumnOptions<any>;
        }[];
        _groupByColumns: {
            column: IExtendedColumnOptions<any>;
        }[];
        _orderByColumns: {
            column: IExtendedColumnOptions<any>;
            direction: "ASC" | "DESC";
        }[];
        _limitTo: number;
        toSQL(): string;
        execute(databaseProvider: IDatabaseProvider): Promise<(Record<Alias1, Pick<Type1, keyof Type1>> & Record<Alias2, Pick<Type2, keyof Type2>>)[]>;
    };
};
