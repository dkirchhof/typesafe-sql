import { Table } from "../Table";

export function insertInto<Type, Alias extends string>(table: Table<Type, Alias>): InsertQuery<Type, Alias>
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

	execute()
	{
		// this.toSQL()

		return { changes: 1, lastID: 1 };
	}

	toSQL()
	{
		return `INSERT INTO ${this.table}(${this.keyList.join(", ")}) VALUES(${this.valueList.join(", ")})`;
	}
}