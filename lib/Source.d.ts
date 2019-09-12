import { Table } from ".";
export declare class Source {
    table: Table<any>;
    private alias;
    constructor(table: Table<any>, alias: string);
    toString(): string;
}
