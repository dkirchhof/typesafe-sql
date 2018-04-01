import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";
import { convertValue } from "..";

export class InsertQuery<Type>
{
	constructor(private table: Table<Type>, private values: Type) { }

	async execute(databaseProvider: IDatabaseProvider)
	{
		const { lastID } = await databaseProvider.execute(this.toSQL());
		return lastID;
	}

	toSQL()
	{
		const columns = Object.keys(this.values).join(", ");

		const values = Object.entries(this.values).map(([column, value]) =>
		{
			const sourceColumn = this.table.columns[column as keyof Type];
			const convertedValue = convertValue(sourceColumn, value);
			const sanitizedValue = sanitizeValue(convertedValue);

			return sanitizedValue;
		}).join(", ");

		return `INSERT INTO ${this.table.tableName}(${columns}) VALUES(${values})`;
	}
}