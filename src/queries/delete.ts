import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";
import { Operator } from "../Operator";
import { columnToString, convertValue } from "..";

type Filter<K extends keyof T, T> = { column: K; value: T[K], operator: Operator };

export class DeleteQuery<Type>
{
	private filters: Filter<any, any>[] = [];

	constructor(private table: Table<Type>) { }

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
		let sql = `DELETE FROM ${this.table.tableName}`;

		if(this.filters.length)
		{
			const filters = this.filters.map(filter =>
			{
				const convertedValue = convertValue(filter.column, filter.value);
				const sanitizedValue = sanitizeValue(convertedValue);

				return `${filter.column} ${filter.operator} ${sanitizedValue}`;
			}).join(" AND ");
			
			sql = `${sql} WHERE ${filters}`;
		}

		return sql;
	}
}