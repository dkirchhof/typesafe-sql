import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";

export function select<
	Type1, Alias1 extends string, Key1 extends keyof Type1>
	(table1: Table<Type1, Alias1>, attributes1: Key1[])
	: Query<Pick<Type1, Key1>, Alias1, any, any, any, any, any, any>;
export function select<
	Type1, Alias1 extends string, Key1 extends keyof Type1,
	Type2, Alias2 extends string, Key2 extends keyof Type2>
	(table1: Table<Type1, Alias1>, attributes1: Key1[],
	table2: Table<Type2, Alias2>, attributes2: Key2[])
	: Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, any, any, any, any>;
export function select<
	Type1, Alias1 extends string, Key1 extends keyof Type1,
	Type2, Alias2 extends string, Key2 extends keyof Type2,
	Type3, Alias3 extends string, Key3 extends keyof Type3>
	(table1: Table<Type1, Alias1>, attributes1: Key1[],
	table2: Table<Type2, Alias2>, attributes2: Key2[],
	table3: Table<Type3, Alias3>, attributes3: Key3[])
	: Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, Pick<Type3, Key3>, Alias3, any, any>;
export function select<
	Type1, Alias1 extends string, Key1 extends keyof Type1,
	Type2, Alias2 extends string, Key2 extends keyof Type2,
	Type3, Alias3 extends string, Key3 extends keyof Type3,
	Type4, Alias4 extends string, Key4 extends keyof Type4>
	(table1: Table<Type1, Alias1>, attributes1: Key1[],
	table2: Table<Type2, Alias2>, attributes2: Key2[],
	table3: Table<Type3, Alias3>, attributes3: Key3[],
	table4: Table<Type4, Alias4>, attributes4: Key4[])
	: Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, Pick<Type3, Key3>, Alias3, Pick<Type4, Key4>, Alias4>;

export function select(
	table1?: Table<any, any>, attributes1?: string[],
	table2?: Table<any, any>, attributes2?: string[],
	table3?: Table<any, any>, attributes3?: string[],
	table4?: Table<any, any>, attributes4?: string[])
{
	const tables: string[] = [];
	let attributes: string[] = [];

	const map = (table: Table<any, any> | undefined, selectedAttributes: string[] | undefined) =>
	{
		if (table && selectedAttributes)
		{
			tables.push(table.alias);

			const mapped = selectedAttributes.map(attribute => `${table.alias}.${attribute} AS ${table.alias}_${attribute}`);
			attributes = attributes.concat(mapped);
		}
	}

	map(table1, attributes1);
	map(table2, attributes2);
	map(table3, attributes3);
	map(table4, attributes4);

	return new Query(tables, attributes);
}

class Query<Type1, Alias1 extends string, Type2, Alias2 extends string, Type3, Alias3 extends string, Type4, Alias4 extends string>
{
	private filters: string[] = [];
	private limitParam: number;

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

	limit(limit: number)
	{
		this.limitParam = limit;

		return this;
	}

	async execute(databaseProvider: IDatabaseProvider): Promise<Record<Alias1, Type1>[] & Record<Alias2, Type2>[] & Record<Alias3, Type3>[] & Record<Alias4, Type4>[]>
	{
		const result = await databaseProvider.get(this.toSQL());
		
		const mappedResult = result.map(item =>
		{
			const mappedItem: any = {};

			this.tables.forEach(table => mappedItem[table] = {});

			const keys = Object.keys(item);
			keys.forEach(key => 
			{
				const [, table, attribute ] = <string[]>key.match(/(.*)_(.*)/);
				mappedItem[table][attribute] = item[key];
			});

			return mappedItem;
		});
		
		return mappedResult;
	}

	toSQL()
	{
		let sql = `SELECT ${this.attributes.join(", ")} FROM ${this.tables.join(", ")}`;

		if(this.filters.length)
		{
			sql = `${sql} WHERE ${this.filters.join(" AND ")}`;
		}

		if(this.limitParam !== undefined)
		{
			sql = `${sql} LIMIT ${this.limitParam}`;
		}

		return sql;
	}
}