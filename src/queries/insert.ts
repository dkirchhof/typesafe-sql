import { convertValueToDB } from "..";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";

export class InsertQuery<Type> {
    private tuples: Type[];

    constructor(private table: Table<Type>, tuples: Type | Type[]) {
        if (Array.isArray(tuples)) {
            this.tuples = tuples;
        } else {
            this.tuples = [tuples];
        }
    }

    public async execute(databaseProvider: IDatabaseProvider) {
        const { lastID } = await databaseProvider.execute(this.toSQL());
        return lastID;
    }

    public toSQL() {
        const columns = Object.keys(this.tuples[0]).join(", ");

        const tuples = this.tuples.map(tuple => {
            const sanitizedValues = Object.values(tuple).map(value => sanitizeValue(value)).join(", ");

            return `(${sanitizedValues})`;

        }).join(", ");

        return `INSERT INTO ${this.table.tableName}(${columns})\n  VALUES${tuples}`;
    }
}
