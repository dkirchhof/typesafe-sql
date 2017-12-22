export class Table<Type>
{
	constructor(public readonly tableName: string) { }
}

export class AliasedTable<Type, Alias extends string>
{
	constructor(public readonly table: Table<Type>, public readonly alias: Alias) { }
}