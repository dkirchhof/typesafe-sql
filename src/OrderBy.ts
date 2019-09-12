import { Column } from "./Column";

export type OrderDirection = "ASC" | "DESC";

export class OrderBy {

    constructor(private readonly column: Column<any>, private readonly direction: OrderDirection) { }

    public toString() {
        return `${this.column} ${this.direction}`;
    }
}
