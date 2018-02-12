import { Table, ExtendedMappedTable, IExtendedColumnOptions, AggregationType } from "../Table";
import { sanitizeValue, columnToString } from "../utils";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Operator } from "../Operator";

// waiting for https://github.com/Microsoft/TypeScript/issues/17293 or https://github.com/Microsoft/TypeScript/issues/15058

export function from<
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
	type Filter = { column: IExtendedColumnOptions<any>; valueOrColumn: any | mappedRecordsPredicate<any>, operator: Operator };
	type GroupBy = { column: IExtendedColumnOptions<any> };
	type OrderBy = { column: IExtendedColumnOptions<any>; direction: "ASC" | "DESC" };

	return new class
	{
		private sources: Source[];
		private isDistinct: boolean;
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

			return tempRecord as mappedRecords;
		}

		distinct()
		{
			this.isDistinct = true;

			return this;
		}

		aggregate(columnSelector: mappedRecordsPredicate<any>, aggregationType: AggregationType): this
		{
			const column = columnSelector(this.record);
			this.sources.find(source => source.tableAlias === column.tableAlias)!.columns[column.columnName!].aggregation = aggregationType;

			return this;
		}
		
		where<T>(columnSelector: mappedRecordsPredicate<T>, valueOrColumnSelector: T | mappedRecordsPredicate<T>, operator: Operator = "=")
		{
			const column = columnSelector(this.record);

			if(typeof valueOrColumnSelector === "function")
			{
				this.filters.push({ column, valueOrColumn: valueOrColumnSelector(this.record), operator });
			}
			else
			{
				this.filters.push({ column, valueOrColumn: valueOrColumnSelector, operator });
			}

			return this;
		}

		groupBy(columnSelector: mappedRecordsPredicate<any>)
		{
			const column = columnSelector(this.record);
			this.groupByColumns.push({ column });

			return this;
		}

		orderBy(columnSelector: mappedRecordsPredicate<any>, direction: "ASC" | "DESC" = "ASC")
		{
			const column = columnSelector(this.record);
			this.orderByColumns.push({ column, direction });

			return this;
		}

		limit(limit: number)
		{
			this.limitTo = limit;

			return this;
		}

		select<Key1 extends keyof Type1, Key2 extends keyof Type2>(keys1: Key1[], keys2?: Key2[])
		{
			type PickedRecord1 = Record<Alias1, Pick<Type1, Key1>>
			type PickedRecord2 = Record<Alias1, Pick<Type2, Key2>>
			type ResultSet = (PickedRecord1 & PickedRecord2)[];

			for(let i = 0; i < arguments.length; i++)
			{
				const keys: string[] = arguments[i];
				
				if(!keys.length)
				{
					Object.values(this.sources[i].columns).forEach(column => column.selected = true);
				}
				else
				{
					for(const key of keys)
					{
						this.sources[i].columns[key].selected = true;
					}
				}
			}
			
			return new class
			{
				constructor(private sources: Source[], private isDistinct: boolean, private filters: Filter[], private groupByColumns: GroupBy[], private orderByColumns: OrderBy[], private limitTo: number) { }
				
				toSQL()
				{
					const columns = this.sources.reduce((prev, current) =>
					{
						const mappedColumns = Object.values(current.columns)
							.filter(column => column.selected)
							.map(column => 
							{
								let computedColumnName = columnToString(column);
								if(column.aggregation)
								{
									computedColumnName = `${column.aggregation}(${computedColumnName})`;
								}

								return `${computedColumnName} AS ${column.tableAlias}_${column.columnName}`;
							});
						
						return prev.concat(mappedColumns);
					}, [] as string[]);

					const tables = this.sources.map(source => `${source.tableName} AS ${source.tableAlias}`);

					let sql = `SELECT ${this.isDistinct ? "DISTINCT ": ""}${columns.join(", ")}\n\tFROM ${tables.join(", ")}`;

					if(this.filters.length)
					{	
						const filters = this.filters.map(filter => `${columnToString(filter.column)} ${filter.operator} ${sanitizeValue(filter.valueOrColumn)}`);
						sql = `${sql}\n\tWHERE ${filters.join(" AND ")}`;
					}

					if(this.groupByColumns.length)
					{
						const groupByColumns = this.groupByColumns.map(groupBy => columnToString(groupBy.column));
						sql = `${sql}\n\tGROUP BY ${groupByColumns.join(" ,")}`;
					}
					
					if(this.orderByColumns.length)
					{
						const orderByColumns = this.orderByColumns.map(orderBy => `${columnToString(orderBy.column)} ${orderBy.direction}`);
						sql = `${sql}\n\tORDER BY ${orderByColumns.join(" ,")}`;
					}

					if(this.limitTo !== undefined)
					{
						sql = `${sql}\n\tLIMIT ${this.limitTo}`;
					}
					
					return sql;
				}

				async execute(databaseProvider: IDatabaseProvider): Promise<ResultSet>
				{
					const result = await databaseProvider.get(this.toSQL());
					
					const mappedResult = result.map(item =>
					{
						const mappedItem: any = {};
						this.sources.forEach(source => mappedItem[source.tableAlias] = {})

						Object.entries(item).forEach(([key, value]) => 
						{
							const [, table, column ] = <string[]>key.match(/(.*)_(.*)/);
							mappedItem[table][column] = value;
						});

						return mappedItem;
					});
					
					return mappedResult;
				}
				
			}(this.sources, this.isDistinct, this.filters, this.groupByColumns, this.orderByColumns, this.limitTo);
		}

	}(arguments);
}