import { Table, ExtendedMappedTable, IExtendedColumnOptions, AggregationType } from "../Table";
import { sanitizeValue } from "../utils";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";

// todo: turn _attributes and _functions back to private
// when https://github.com/Microsoft/TypeScript/issues/17293 or https://github.com/Microsoft/TypeScript/issues/15058 is fixed

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
	type Filter = { column: IExtendedColumnOptions<any>; value: any };
	type JoinFilter = { column1: IExtendedColumnOptions<any>; column2: IExtendedColumnOptions<any> };
	type GroupBy = { column: IExtendedColumnOptions<any> };
	type OrderBy = { column: IExtendedColumnOptions<any>; direction: "ASC" | "DESC" };

	type Key1 = keyof Type1;
	type Key2 = keyof Type2;
	
	type PickedRecord1 = Record<Alias1, Pick<Type1, Key1>>;
	type PickedRecord2 = Record<Alias2, Pick<Type2, Key2>>;
	type ResultSet = PickedRecord1 & PickedRecord2;
	
	return new class
	{
		public _sources: Source[];
		public _filters: Filter[] = [];
		public _joinFilters: JoinFilter[] = [];
		public _groupByColumns: GroupBy[] = [];
		public _orderByColumns: OrderBy[] = [];
		public _limitTo: number;

		public _record: mappedRecords;

		constructor(tablesAndAliases: IArguments)//: { table: Table<any>, alias: string }[])
		{			
			this._sources = this._createSources(tablesAndAliases);
			this._record = this._createRecord(this._sources);			
		}

		_createSources(sources: IArguments)
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

		_createRecord(sources: Source[])
		{
			const tempRecord: any = { };
			sources.forEach(source => tempRecord[source.tableAlias] = source.columns);

			return tempRecord;
		}

		aggregate(columnSelector: mappedRecordsPredicate<any>, aggregationType: AggregationType)
		{
			const column = columnSelector(this._record);
			this._sources.find(source => source.tableAlias === column.tableAlias)!.columns[column.columnName!].aggregation = aggregationType;

			return this;
		}
		
		where<T>(columnSelector: mappedRecordsPredicate<T>, value: T)
		{
			const column = columnSelector(this._record);
			this._filters.push({ column, value });

			return this;
		}

		joinOn<T>(columnSelector1: mappedRecordsPredicate<T>, columnSelector2: mappedRecordsPredicate<T>)
		{
			const column1 = columnSelector1(this._record);
			const column2 = columnSelector2(this._record);
			
			this._joinFilters.push({ column1, column2 });

			return this;
		}

		groupBy(columnSelector: mappedRecordsPredicate<any>)
		{
			const column = columnSelector(this._record);
			this._groupByColumns.push({ column });

			return this;
		}

		orderBy(columnSelector: mappedRecordsPredicate<any>, direction: "ASC" | "DESC" = "ASC")
		{
			const column = columnSelector(this._record);
			this._orderByColumns.push({ column, direction });

			return this;
		}

		limit(limit: number)
		{
			this._limitTo = limit;

			return this;
		}

		select(keys1: Key1[], keys2?: Key2[]) //: Record<Alias1, Pick<Type1, Key1>> & Record<Alias2, Pick<Type2, Key2>>
		{
			for(let i = 0; i < arguments.length; i++)
			{
				const keys: string[] = arguments[i];
				
				for(const key of keys)
				{
					this._sources[i].columns[key].selected = true;
				}
			}
			
			return new class
			{
				constructor(public _sources: Source[], public _filters: Filter[], public _joinFilters: JoinFilter[], public _groupByColumns: GroupBy[], public _orderByColumns: OrderBy[], public _limitTo: number) { }
				
				toSQL()
				{
					const columns = this._sources.reduce((prev, current) =>
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

					const tables = this._sources.map(source => `${source.tableName} ${source.tableAlias}`);

					let sql = `SELECT ${columns.join(", ")}\n\tFROM ${tables.join(", ")}`;

					if(this._filters.length || this._joinFilters.length)
					{
						const joinFilters = this._joinFilters.map(filter => `${filter.column1.tableAlias}.${filter.column1.columnName} = ${filter.column2.tableAlias}.${filter.column2.columnName}`);
						const valueFilters = this._filters.map(filter => `${filter.column.tableAlias}.${filter.column.columnName} = ${sanitizeValue(filter.value)}`);
						const filters = joinFilters.concat(valueFilters);

						sql = `${sql}\n\tWHERE ${filters.join(" AND ")}`;
					}

					if(this._groupByColumns.length)
					{
						const groupByColumns = this._groupByColumns.map(groupBy => `${groupBy.column.tableAlias}.${groupBy.column.columnName}`);
						sql = `${sql}\n\tGROUP BY ${groupByColumns.join(" ,")}`;
					}
					
					if(this._orderByColumns.length)
					{
						const orderByColumns = this._orderByColumns.map(orderBy => `${orderBy.column.tableAlias}.${orderBy.column.columnName}`);
						sql = `${sql}\n\tORDER BY ${orderByColumns.join(" ,")}`;
					}

					if(this._limitTo !== undefined)
					{
						sql = `${sql}\n\tLIMIT ${this._limitTo}`;
					}
					
					return sql;
				}

				async execute(databaseProvider: IDatabaseProvider): Promise<ResultSet[]>
				{
					const result = await databaseProvider.get(this.toSQL());
					
					const mappedResult = result.map(item =>
					{
						const mappedItem: any = {};
						this._sources.forEach(source => mappedItem[source.tableAlias] = {})

						Object.entries(item).forEach(([key, value]) => 
						{
							const [, table, column ] = <string[]>key.match(/(.*)_(.*)/);
							mappedItem[table][column] = value;
						});

						return mappedItem;
					});
					
					return mappedResult;
				}
				
			}(this._sources, this._filters, this._joinFilters, this._groupByColumns, this._orderByColumns, this._limitTo);
		}

	}(arguments);
}