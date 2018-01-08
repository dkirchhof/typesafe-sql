import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";

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
		const values = Object.values(this.values).map(value => sanitizeValue(value)).join(", ");

		return `INSERT INTO ${this.table.tableName}(${columns}) VALUES(${values})`;
	}
}