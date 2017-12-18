import { Table } from "../Table";
import { Query } from "../Query";

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