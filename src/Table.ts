export interface IColumnOptions<Type>
{
	dataType: DataType;
	primary?: boolean;
	foreign?: ForeignKey<any>
	notNull?: boolean;
	unique?: boolean;
	default?: Type;
}

export interface IExtendedColumnOptions<Type> extends IColumnOptions<Type>
{
	type?: Type;
	columnName?: string;
	tableAlias?: string;
	selected?: boolean;
	aggregation?: AggregationType;
}

export class ForeignKey<Type>
{
	constructor(public readonly table: Table<Type>, public readonly column: keyof Type, public readonly onDelete: Action = "NO ACTION", public readonly onUpdate: Action = "NO ACTION") { }
}

export type MappedTable<Type> = { [K in keyof Type]: IColumnOptions<Type[K]> };
export type ExtendedMappedTable<Type> = { [K in keyof Type]: IExtendedColumnOptions<Type[K]> };

export type DataType = "TEXT" | "INT";
export type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE"
export type AggregationType = "COUNT" | "SUM" | "AVG";

export class Table<Type>
{
	public readonly columns: ExtendedMappedTable<Type>;

	constructor(public readonly tableName: string, columns: MappedTable<Type>)
	{
		Object.entries(columns as ExtendedMappedTable<any>).forEach(([key, value]) => value.columnName = key);
		this.columns = columns;
	}
}