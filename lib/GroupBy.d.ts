import { Column } from "./Column";
export declare class GroupBy {
    private readonly column;
    constructor(column: Column<any>);
    toString(): string;
}
