import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";

type Filter<K extends keyof T, T> = { column: K; value: T[K] };

export class DeleteQuery<Type>
{
	private filters: Filter<any, any>[] = [];

	constructor(private table: Table<Type>) { }

	where<Key extends keyof Type>(column: Key, value: Type[Key])
	{
		this.filters.push({ column, value });
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
			const filters = this.filters.map(filter => `${filter.column} = ${sanitizeValue(filter.value)}`).join(" AND ");
			sql = `${sql} WHERE ${filters}`;
		}

		return sql;
	}
}