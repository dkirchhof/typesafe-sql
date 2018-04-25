import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";
import { Operator } from "../Operator";
import { columnToString, convertValue } from "..";
import { Filter } from "../Filter";

export class DeleteQuery<Type>
{
	private filters: Filter<Type, keyof Type>[] = [];

	constructor(private table: Table<Type>) { }

	where<Key extends keyof Type>(column: Key, operator: Operator, value: Type[Key])
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