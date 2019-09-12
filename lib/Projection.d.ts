import { Column } from "./Column";
export declare class Projection {
    private column;
    private alias;
    constructor(column: Column<any>, alias: string);
    toString(): string;
}
