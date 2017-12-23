import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";

export function update<Type>(table: Table<Type>): UpdateQuery<Type>
{
	return new UpdateQuery(table);
}

export class UpdateQuery<Type>
{
	private values: string[];
	private filters: string[] = [];

	constructor(private table: Table<Type>) { }

	set(values: Partial<Type>)
	{
		this.values = Object.keys(values).map((key: keyof Type) => `${key} = ${sanitizeValue(values[key])}`);

		return this;
	}

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
		let sql = `UPDATE ${this.table.tableName} SET ${this.values.join(", ")}`;

		if(this.filters.length)
		{
			sql = `${sql} WHERE ${this.filters.join(" AND ")}`;
		}

		return sql;
	}
}