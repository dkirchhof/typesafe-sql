import { Column } from "./Column";
export declare type OrderDirection = "ASC" | "DESC";
export declare class OrderBy {
    private readonly column;
    private readonly direction;
    constructor(column: Column<any>, direction: OrderDirection);
    toString(): string;
}
