import { Column } from "./Column";

export class Projection {
    constructor(private column: Column<any>, private alias: string) { }

    public toString() {
        return `${this.column} AS ${this.alias}`;
    }
}
