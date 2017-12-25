import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";

export function deleteFrom<Type>(table: Table<Type>): DeleteQuery<Type>
{
	return new DeleteQuery(table);
}

export class DeleteQuery<Type>
{
	private filters: string[] = [];

	constructor(private table: Table<Type>) { }

	where<Key extends keyof Type>(key: Key, value: Type[Key])
	{
		this.filters.push(`${key} = ${sanitizeValue(value)}`);
		
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
			sql = `${sql} WHERE ${this.filters.join(" AND ")}`;
		}

		return sql;
	}
}