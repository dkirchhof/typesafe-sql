import { columnToString, convertValue } from "..";
import { IFilter } from "../Filter";
import { Operator } from "../Operator";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";

export class UpdateQuery<Type> {
    private filters: Array<IFilter<Type, keyof Type>> = [];

    constructor(private table: Table<Type>, private values: Partial<Type>) { }

    public where<Key extends keyof Type>(column: Key, operator: Operator, value: Type[Key]) {
        this.filters.push({ column, operator, value });
        return this;
    }

    public async execute(databaseProvider: IDatabaseProvider) {
        const { changes } = await databaseProvider.execute(this.toSQL());
        return changes;
    }

    public toSQL() {
        const values = Object.entries(this.values).map(([column, value]) => {
            const sourceColumn = this.table.columns[column as keyof Type];
            const convertedValue = convertValue(sourceColumn, value);
            const sanitizedValue = sanitizeValue(convertedValue);

            return `${column} = ${sanitizedValue}`;
        }).join(", ");

        let sql = `UPDATE ${this.table.tableName}\n  SET ${values}`;

        if (this.filters.length) {
            const filters = this.filters.map(filter => {
                const sourceColumn = this.table.columns[filter.column];
                const convertedValue = convertValue(sourceColumn, filter.value);
                const sanitizedValue = sanitizeValue(convertedValue);

                return `${filter.column} ${filter.operator} ${sanitizedValue}`;
            }).join(" AND ");

            sql = `${sql}\n  WHERE ${filters}`;
        }

        return sql;
    }
}
