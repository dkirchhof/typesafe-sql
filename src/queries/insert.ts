import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";

export function insertInto<Type>(table: Table<Type>): InsertQuery<Type>
{
	return new InsertQuery(table);
}

class InsertQuery<Type>
{
	private keyList: string[];
	private valueList: string[];

	constructor(private table: Table<Type>) { }

	values(values: Type)
	{
		this.keyList = Object.keys(values);
		this.valueList = Object.values(values).map(value => sanitizeValue(value))

		return this;
	}

	async execute(databaseProvider: IDatabaseProvider)
	{
		const { lastID } = await databaseProvider.execute(this.toSQL());
		return lastID;
	}

	toSQL()
	{
		return `INSERT INTO ${this.table.tableName}(${this.keyList.join(", ")}) VALUES(${this.valueList.join(", ")})`;
	}
}