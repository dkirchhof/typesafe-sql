import { Table } from ".";
export declare class Source {
    table: Table<any>;
    constructor(table: Table<any>);
    toString(): string;
}
export declare class AliasedSource extends Source {
    alias: string;
    constructor(table: Table<any>, alias: string);
    toString(): string;
}
