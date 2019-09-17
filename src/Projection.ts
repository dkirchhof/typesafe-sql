import { Column } from "./Column";

export class Projection {
    constructor(public column: Column<any>, public alias: string) { }

    public toString() {
        return `${this.column} AS ${this.alias}`;
    }
}
