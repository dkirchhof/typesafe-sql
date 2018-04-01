import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";
import { convertValue, columnToString } from "..";
import { Operator } from "../Operator";

type Filter<K extends keyof T, T> = { column: K; value: T[K], operator: Operator  };

export class UpdateQuery<Type>
{
	private filters: Filter<keyof Type, Type>[] = [];

	constructor(private table: Table<Type>, private values: Partial<Type>) { }

	where<Key extends keyof Type>(column: Key, value: Type[Key], operator: Operator = "=")
	{
		this.filters.push({ column, value, operator });
		return this;
	}

	async execute(databaseProvider: IDatabaseProvider)
	{
		const { changes } = await databaseProvider.execute(this.toSQL());
		return changes;
	}

	toSQL()
	{
		const values = Object.entries(this.values).map(([column, value]) =>
		{
			const sourceColumn = this.table.columns[column as keyof Type];
			const convertedValue = convertValue(sourceColumn, value);
			const sanitizedValue = sanitizeValue(convertedValue);

			return `${column} = ${sanitizedValue}`;
		}).join(", ");

		let sql = `UPDATE ${this.table.tableName} SET ${values}`;

		if(this.filters.length)
		{
			const filters = this.filters.map(filter =>
			{
				const sourceColumn = this.table.columns[filter.column];
				const convertedValue = convertValue(sourceColumn, filter.value);
				const sanitizedValue = sanitizeValue(convertedValue);

				return `${filter.column} ${filter.operator} ${sanitizedValue}`;
			}).join(" AND ");
			
			sql = `${sql} WHERE ${filters}`;
		}

		return sql;
	}
}