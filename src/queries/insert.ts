import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";

export function insertInto<Type, Alias extends string>(databaseProvider: IDatabaseProvider, table: Table<Type, Alias>): InsertQuery<Type, Alias>
{
	return new InsertQuery(table.alias);
}

class InsertQuery<Type, Alias extends string>
{
	private keyList: string[];
	private valueList: string[];

	constructor(private table: string) { }

	values(data: Type)
	{
		this.keyList = Object.keys(data);
		this.valueList = Object.values(data).map(value => typeof value === "string" ? `"${value}"` : value)

		return this;
	}

	async execute(databaseProvider: IDatabaseProvider)
	{
		const { changes, lastID } = await databaseProvider.execute(this.toSQL());
		return { changes, lastID };
	}

	toSQL()
	{
		return `INSERT INTO ${this.table}(${this.keyList.join(", ")}) VALUES(${this.valueList.join(", ")})`;
	}
}