import { IColumnOptions } from "./Table";
export declare class Column<Type> {
    readonly name: string;
    readonly options: IColumnOptions<any>;
    private type?;
    constructor(name: string, options: IColumnOptions<any>);
    toString(): string;
}
export declare class AliasedColumn<Type> extends Column<Type> {
    readonly tableAlias: string;
    constructor(tableAlias: string, name: string, options: IColumnOptions<any>);
    toString(): string;
}
