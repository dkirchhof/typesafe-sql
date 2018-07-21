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
            const values = Object.entries(tuple).map(([column, value]) => {
                const sourceColumn = this.table.columns[column as keyof Type];
                const convertedValue = convertValueToDB(sourceColumn, value);
                const sanitizedValue = sanitizeValue(convertedValue);

                return sanitizedValue;
            }).join(", ");

            return `(${values})`;

        }).join(", ");

        return `INSERT INTO ${this.table.tableName}(${columns})\n  VALUES${tuples}`;
    }
}
