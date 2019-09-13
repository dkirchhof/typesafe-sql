import { Table } from ".";
export declare class Source {
    protected table: Table<any>;
    constructor(table: Table<any>);
    toString(): string;
}
export declare class AliasedSource extends Source {
    private alias;
    constructor(table: Table<any>, alias: string);
    toString(): string;
}
