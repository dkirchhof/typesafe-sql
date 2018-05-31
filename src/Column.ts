import { IExtendedColumnOptions } from ".";

export class Column {
    constructor(public readonly column: IExtendedColumnOptions<any>, protected wrappedBy?: string[]) { }

    public wrap(before: string, after: string) {
        this.wrappedBy = [before, after];
    }

    public toString() {
        const name  = `${this.column.tableAlias}.${this.column.columnName}`;

        return this.wrappedBy ? `${this.wrappedBy[0]}${name}${this.wrappedBy[1]}` : name;
    }
}

export class ProjectionColumn extends Column {
    constructor(column: IExtendedColumnOptions<any>, private alias: string, wrappedBy?: string[]) {
        super(column, wrappedBy);
    }

    public toString() {
        return `${super.toString()} AS ${this.alias}`;
    }
}

export class OrderByColumn extends Column {
    constructor(column: IExtendedColumnOptions<any>, private direction: "ASC" | "DESC", wrappedBy?: string[]) {
        super(column, wrappedBy);
    }

    public toString() {
        return `${super.toString()} ${this.direction}`;
    }
}
