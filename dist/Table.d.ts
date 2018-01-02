export declare class Table<Type> {
    readonly tableName: string;
    constructor(tableName: string);
}
export declare class AliasedTable<Type, Alias extends string> {
    readonly table: Table<Type>;
    readonly alias: Alias;
    constructor(table: Table<Type>, alias: Alias);
}
