import { CreateQuery } from "./queries/create";
import { SelectQuery } from "./queries/simpleSelect";
import { DropQuery } from "./queries/drop";
import { InsertQuery } from "./queries/insert";
import { UpdateQuery } from "./queries/update";
import { DeleteQuery } from "./queries/delete";

export interface IColumnOptions<Type>
{
	dataType: DataType;
	primary?: boolean;
	references?: ForeignKey<any>
	notNull?: boolean;
	unique?: boolean;
	default?: Type;
	converter?: IConverter<Type>;
}

export interface IExtendedColumnOptions<Type> extends IColumnOptions<Type>
{
	type?: Type;
	columnName?: string;
	tableAlias?: string;
	selected?: boolean;
	aggregation?: AggregationType;
	wrappedBy?: string[];
}

export class ForeignKey<Type>
{
	constructor(readonly table: Table<Type>, readonly column: keyof Type, readonly onDelete?: Action, readonly onUpdate?: Action) { }
}

export interface IConverter<Type>
{
	toJS: (input: any) => Type;
	toDB: (input: Type) => any;
}

export type MappedTable<Type> = { [K in keyof Type]: IColumnOptions<Type[K]> };
export type ExtendedMappedTable<Type> = { [K in keyof Type]: IExtendedColumnOptions<Type[K]> };

export type DataType = "TEXT" | "INTEGER";
export type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE"
export type AggregationType = "COUNT" | "SUM" | "AVG" | "MIN" | "MAX";

export class Table<Type>
{
	public readonly columns: ExtendedMappedTable<Type>;

	constructor(public readonly tableName: string, columns: MappedTable<Type>)
	{
		Object.entries(columns as ExtendedMappedTable<any>).forEach(([key, value]) => value.columnName = key);
		this.columns = columns;
	}

	create()
	{
		return new CreateQuery(this);
	}

	drop()
	{
		return new DropQuery(this);
	}

	select<SelectedColumns extends keyof Type>(...columns: SelectedColumns[])
	{
		return new SelectQuery<Type, SelectedColumns>(this, columns);
	}

	selectAll()
	{
		return new SelectQuery<Type, keyof Type>(this, []);
	}

	insert(values: Type)
	{
		return new InsertQuery<Type>(this, values);
	}

	update(values: Partial<Type>)
	{
		return new UpdateQuery<Type>(this, values);
	}

	delete()
	{
		return new DeleteQuery<Type>(this);
	}
}