import { Table } from "./Table";

export class Query<Type1, Alias1 extends string, Type2, Alias2 extends string, Type3, Alias3 extends string, Type4, Alias4 extends string>
{
	private filters: string[] = [];

	constructor(private tables: string[], private attributes: string[]) { }

	where<Type, Alias extends string, Key extends keyof Type>(table: Table<Type, Alias>, key: Key, value: Type[Key])
	{
		this.filters.push(`${table.alias}.${key} = ${value}`);
		
		return this;
	}

	joinOn<TypeA extends Type1, AliasA extends string, KeyA extends keyof TypeA, TypeB, AliasB extends string, KeyB extends keyof TypeB>(table1: Table<TypeA, AliasA>, key1: KeyA, table2: Table<TypeB, AliasB>, key2: KeyB)
	{
		this.filters.push(`${table1.alias}.${key1} = ${table2.alias}.${key2}`);
		
		return this;
	}

	getOne()
	{
		return {} as Record<Alias1, Type1> & Record<Alias2, Type2> & Record<Alias3, Type3> & Record<Alias4, Type4>;
	}

	getMany()
	{
		return [] as Record<Alias1, Type1>[] & Record<Alias2, Type2>[] & Record<Alias3, Type3>[] & Record<Alias4, Type4>[]
	}

	toSQL()
	{
		let sql = `SELECT ${this.attributes.join(", ")} FROM ${this.tables.join(", ")}`;

		if(this.filters.length)
		{
			sql = `${sql} WHERE ${this.filters.join(" AND ")}`;
		}

		return sql;
	}
}