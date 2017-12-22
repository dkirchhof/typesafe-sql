import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { AliasedTable } from "../Table";
import { sanitizeValue } from "../utils";

export function select<
	Type1, Alias1 extends string, Key1 extends keyof Type1>
	(aliasedTable1: AliasedTable<Type1, Alias1>, attributes1: Key1[])
	: Query<Pick<Type1, Key1>, Alias1, any, any, any, any, any, any>;
export function select<
	Type1, Alias1 extends string, Key1 extends keyof Type1,
	Type2, Alias2 extends string, Key2 extends keyof Type2>
	(aliasedTable1: AliasedTable<Type1, Alias1>, attributes1: Key1[],
	aliasedTable2: AliasedTable<Type2, Alias2>, attributes2: Key2[])
	: Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, any, any, any, any>;
export function select<
	Type1, Alias1 extends string, Key1 extends keyof Type1,
	Type2, Alias2 extends string, Key2 extends keyof Type2,
	Type3, Alias3 extends string, Key3 extends keyof Type3>
	(aliasedTable1: AliasedTable<Type1, Alias1>, attributes1: Key1[],
	aliasedTable2: AliasedTable<Type2, Alias2>, attributes2: Key2[],
	aliasedTable3: AliasedTable<Type3, Alias3>, attributes3: Key3[])
	: Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, Pick<Type3, Key3>, Alias3, any, any>;
export function select<
	Type1, Alias1 extends string, Key1 extends keyof Type1,
	Type2, Alias2 extends string, Key2 extends keyof Type2,
	Type3, Alias3 extends string, Key3 extends keyof Type3,
	Type4, Alias4 extends string, Key4 extends keyof Type4>
	(aliasedTable1: AliasedTable<Type1, Alias1>, attributes1: Key1[],
	aliasedTable2: AliasedTable<Type2, Alias2>, attributes2: Key2[],
	aliasedTable3: AliasedTable<Type3, Alias3>, attributes3: Key3[],
	aliasedTable4: AliasedTable<Type4, Alias4>, attributes4: Key4[])
	: Query<Pick<Type1, Key1>, Alias1, Pick<Type2, Key2>, Alias2, Pick<Type3, Key3>, Alias3, Pick<Type4, Key4>, Alias4>;

export function select(
	aliasedTable1?: AliasedTable<any, any>, attributes1?: string[],
	aliasedTable2?: AliasedTable<any, any>, attributes2?: string[],
	aliasedTable3?: AliasedTable<any, any>, attributes3?: string[],
	aliasedTable4?: AliasedTable<any, any>, attributes4?: string[])
{
	const tables: AliasedTable<any, any>[] = [];
	let attributes: string[] = [];

	const map = (table: AliasedTable<any, any> | undefined, selectedAttributes: string[] | undefined) =>
	{
		if (table && selectedAttributes)
		{
			tables.push(table);

			const mapped = selectedAttributes.map(attribute => `${table.alias}.${attribute} AS ${table.alias}_${attribute}`);
			attributes = attributes.concat(mapped);
		}
	}

	map(aliasedTable1, attributes1);
	map(aliasedTable2, attributes2);
	map(aliasedTable3, attributes3);
	map(aliasedTable4, attributes4);

	return new Query(tables, attributes);
}

class Query<Type1, Alias1 extends string, Type2, Alias2 extends string, Type3, Alias3 extends string, Type4, Alias4 extends string>
{
	private filters: string[] = [];
	private limitParam: number;

	constructor(private aliasedTables: AliasedTable<any, any>[], private attributes: string[]) { }

	where<TypeA, AliasA extends string, Key extends keyof TypeA>(table: AliasedTable<any, any>, key: Key, value: TypeA[Key])
	{
		this.filters.push(`${table.alias}.${key} = ${sanitizeValue(value)}`);
		
		return this;
	}

	joinOn<TypeA extends Type1, AliasA extends string, KeyA extends keyof TypeA, TypeB, AliasB extends string, KeyB extends keyof TypeB>(aliasedTable1: AliasedTable<TypeA, AliasA>, key1: KeyA, aliasedTable2: AliasedTable<TypeB, AliasB>, key2: KeyB)
	{
		this.filters.push(`${aliasedTable1.alias}.${key1} = ${aliasedTable2.alias}.${key2}`);
		
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

			this.aliasedTables.forEach(aliasedTable => mappedItem[aliasedTable.alias] = {});

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
		let sql = `SELECT ${this.attributes.join(", ")} FROM ${this.aliasedTables.map(AliasedTable => `${AliasedTable.table.tableName} ${AliasedTable.alias}`).join(", ")}`;

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