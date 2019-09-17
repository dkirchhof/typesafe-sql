import { Column } from "./Column";
export declare class Projection {
    column: Column<any>;
    alias: string;
    constructor(column: Column<any>, alias: string);
    toString(): string;
}
