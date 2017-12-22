import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";

export function dropTable<Type>(table: Table<Type>)
{
	return new DropQuery(table);
}

class DropQuery<Type>
{
	constructor(private readonly table: Table<Type>) { }

	async execute(databaseProvider: IDatabaseProvider)
	{
		await databaseProvider.execute(this.toSQL());
	}

	toSQL()
	{
		return `DROP TABLE ${this.table.tableName}`;
	}
}