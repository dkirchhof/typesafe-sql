import { Column } from "./Column";

export class GroupBy {

    constructor(private readonly column: Column<any>) { }

    public toString() {
        return `${this.column}`;
    }
}
