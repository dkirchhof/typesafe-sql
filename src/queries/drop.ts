import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";

export class DropQuery
{
	constructor(private readonly table: Table<any>) { }

	async execute(databaseProvider: IDatabaseProvider)
	{
		await databaseProvider.execute(this.toSQL());
	}

	toSQL()
	{
		return `DROP TABLE ${this.table.tableName}`;
	}
}