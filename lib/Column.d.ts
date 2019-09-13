export declare class Column<Type> {
    protected readonly columnName: string;
    private type?;
    constructor(columnName: string);
    toString(): string;
}
export declare class AliasedColumn<Type> extends Column<Type> {
    private readonly tableAlias;
    constructor(tableAlias: string, columnName: string);
    toString(): string;
}
