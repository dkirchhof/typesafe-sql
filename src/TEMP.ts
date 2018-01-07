import { sanitizeValue } from "./utils";

interface Person
{
	firstname: string;
	lastname: string;
	age: number;
}

interface Course
{
	name: string;
}

export type MappedTable<Type> = { [K in keyof Type]: IColumnOptions<Type[K]> };
export type ExtendedMappedTable<Type> = { [K in keyof Type]: IExtendedColumnOptions<Type[K]> };

export interface IColumnOptions<Type>
{
	dataType: "TEXT" | "INT";
}

export interface IExtendedColumnOptions<Type> extends IColumnOptions<Type>
{
	type?: Type;
	columnName?: string;
	tableAlias?: string;
	selected?: boolean;
	aggregation?: "BLABLABLA";
}

class Table<Type>
{
	public readonly columns: ExtendedMappedTable<Type>;

	constructor(public readonly tableName: string, columns: MappedTable<Type>)
	{
		Object.entries(columns as ExtendedMappedTable<any>).forEach(([key, value]) => value.columnName = key);
		this.columns = columns;
	}
}

const personTable = new Table<Person>("persons", {
	age: { dataType: "INT" },
	firstname: { dataType: "INT" },
	lastname: { dataType: "INT" }
});

function from<
	Type1, Alias1 extends string, 
	Type2, Alias2 extends string> (
	table1: Table<Type1>, alias1: Alias1,
	table2?: Table<Type2>, alias2?: Alias2)
{
	type mappedRecord1 = Record<Alias1, ExtendedMappedTable<Type1>>;
	type mappedRecord2 = Record<Alias2, ExtendedMappedTable<Type2>>;
	type mappedRecords = mappedRecord1 & mappedRecord2;

	type mappedRecordsPredicate<T> = (tables: mappedRecords) => IExtendedColumnOptions<T>;
	
	type Source = { tableName: string; tableAlias: string; columns: ExtendedMappedTable<any> };
	type Filter = { column: IExtendedColumnOptions<any>; value: any };
	type GroupBy = { column: IExtendedColumnOptions<any> };
	type OrderBy = { column: IExtendedColumnOptions<any>; direction: "ASC" | "DESC" };

	type Key1 = keyof Type1;
	type Key2 = keyof Type2;
	
	type PickedRecord1 = Record<Alias1, Pick<Type1, Key1>>;
	type PickedRecord2 = Record<Alias2, Pick<Type2, Key2>>;
	type ResultSet = PickedRecord1 & PickedRecord2;
	
	return new class
	{
		private sources: Source[];
		private filters: Filter[] = [];
		private groupByColumns: GroupBy[] = [];
		private orderByColumns: OrderBy[] = [];
		private limitTo: number;

		private record: mappedRecords;

		constructor(tablesAndAliases: IArguments)//: { table: Table<any>, alias: string }[])
		{			
			this.sources = this.createSources(tablesAndAliases);
			this.record = this.createRecord(this.sources);			
		}

		private createSources(sources: IArguments)
		{
			let tempSources: Source[] = [];

			for(let i = 0; i < sources.length; i+=2)
			{
				const table: Table<any> = sources[i];
				const alias: string = sources[i+1];

				// copy columns object
				const columnsCopy: ExtendedMappedTable<any> = JSON.parse(JSON.stringify(table.columns));
				// set tableAlias for each column
				Object.values(columnsCopy).forEach(column => column.tableAlias = alias);	
				// return mapped source
				tempSources.push({ tableName: table.tableName, tableAlias: alias, columns: columnsCopy });
			}

			return tempSources;
		}

		private createRecord(sources: Source[])
		{
			const tempRecord: any = { };
			sources.forEach(source => tempRecord[source.tableAlias] = source.columns);

			return tempRecord;
		}

		aggregate(predicate: mappedRecordsPredicate<any>, aggregationType: "BLABLABLA")
		{
			const column = predicate(this.record);
			this.sources.find(source => source.tableAlias === column.tableAlias)!.columns[column.columnName!].aggregation = aggregationType;

			return this;
		}
		
		where<T>(predicate: mappedRecordsPredicate<T>, value: T)
		{
			const column = predicate(this.record);
			this.filters.push({ column, value });

			return this;
		}

		groupBy(predicate: mappedRecordsPredicate<any>)
		{
			const column = predicate(this.record);
			this.groupByColumns.push({ column });

			return this;
		}

		orderBy(predicate: mappedRecordsPredicate<any>, direction: "ASC" | "DESC" = "ASC")
		{
			const column = predicate(this.record);
			this.orderByColumns.push({ column, direction });

			return this;
		}

		limit(limit: number)
		{
			this.limitTo = limit;

			return this;
		}

		select(keys1: Key1[], keys2?: Key2[]) //: Record<Alias1, Pick<Type1, Key1>> & Record<Alias2, Pick<Type2, Key2>>
		{
			for(let i = 0; i < arguments.length; i++)
			{
				const keys: string[] = arguments[i];
				
				for(const key of keys)
				{
					this.sources[i].columns[key].selected = true;
				}
			}
			
			return new class
			{
				constructor(private sources: Source[], private filters: Filter[], private groupByColumns: GroupBy[], private orderByColumns: OrderBy[], private limitTo: number) { }
				
				toSQL()
				{
					const columns = this.sources.reduce((prev, current) =>
					{
						const mappedColumns = Object.values(current.columns)
							.filter(column => column.selected)
							.map(column => 
							{
								let computedColumnName = `${column.tableAlias}.${column.columnName}`;
								if(column.aggregation)
								{
									computedColumnName = `${column.aggregation}(${computedColumnName})`;
								}

								return `${computedColumnName} AS ${column.tableAlias}_${column.columnName}`;
							});
						
						return prev.concat(mappedColumns);
					}, [] as string[]);

					const tables = this.sources.map(source => `${source.tableName} ${source.tableAlias}`);

					let sql = `SELECT ${columns.join(", ")}\n\tFROM ${tables.join(", ")}`;

					if(this.filters.length)
					{
						const filters = this.filters.map(filter => `${filter.column.tableAlias}.${filter.column.columnName} = ${sanitizeValue(filter.value)}`);
						sql = `${sql}\n\tWHERE ${filters.join(" AND ")}`;
					}

					if(this.groupByColumns.length)
					{
						const groupByColumns = this.groupByColumns.map(groupBy => `${groupBy.column.tableAlias}.${groupBy.column.columnName}`);
						sql = `${sql}\n\tGROUP BY ${groupByColumns.join(" ,")}`;
					}
					
					if(this.orderByColumns.length)
					{
						const orderByColumns = this.orderByColumns.map(orderBy => `${orderBy.column.tableAlias}.${orderBy.column.columnName}`);
						sql = `${sql}\n\tORDER BY ${orderByColumns.join(" ,")}`;
					}

					if(this.limitTo !== undefined)
					{
						sql = `${sql}\n\tLIMIT ${this.limitTo}`;
					}
					
					console.log(sql);
				}

				// execute(): ResultSet
				// {
					
				// }
			}(this.sources, this.filters, this.groupByColumns, this.orderByColumns, this.limitTo);
		}

	}(arguments);
}

from(personTable, "test", personTable, "bla")
	.aggregate(tables => tables.bla.firstname, "BLABLABLA")
	.where(tables => tables.test.age, 1)
	.where(tables => tables.bla.age, 1)
	.groupBy(tables => tables.bla.firstname)
	.orderBy(tables => tables.bla.lastname, "DESC")
	.limit(1)
	.select(["firstname"], ["firstname", "lastname"])
	.toSQL()
	// .execute();