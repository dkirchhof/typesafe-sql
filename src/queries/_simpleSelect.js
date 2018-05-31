// import { IDatabaseProvider } from "../providers/IDatabaseProvider";
// import { Table, AggregationType, WrappedColumn } from "../Table";
// import { sanitizeValue } from "../utils";
// import { convertValue } from "..";
// import { Operator } from "../Operator";
// import { FilterableQuery } from "./FilterableQuery";
// import { Column, OrderByColumn, ProjectionColumn } from "../Column";
// type ExtendedColumn<SelectedColumn> = { column: SelectedColumn, wrappedBy?: string[] }
// type GroupBy<Type> = { column: keyof Type, wrappedBy?: string[] };
// type OrderBy<Type> = { column: keyof Type; direction: "ASC" | "DESC", wrappedBy?: string[] }
// export class SelectQuery<Type, SelectedColumn extends keyof Type> extends FilterableQuery<Type>
// {   
// 	private isDistinct: boolean;
// 	public selectedColumns: ProjectionColumn[];
// 	private groupByColumns: Column[] = [];
// 	private orderByColumns: OrderByColumn[] = [];
// 	private limitTo: number;
//     constructor(table: Table<Type>, selectedColumns: SelectedColumn[])
//     { 
// 		super(table);
// 		this.selectedColumns = selectedColumns.map(column => new ProjectionColumn(column));
// 	}
// 	distinct()
// 	{
// 		this.isDistinct = true;
// 		return this;
// 	}
// 	wrapColumn(column: SelectedColumn, before: string, after: string)
// 	{
// 		this.selectedColumns.find(c => c.column === column)!.wrap(before, after);
// 		return this;
// 	}
// 	aggregate(column: SelectedColumn, aggregation: AggregationType)
// 	{
// 		return this.wrapColumn(column, `${aggregation}(`, `)`);
// 	}
// 	groupBy(column: keyof Type | WrappedColumn<Type>)
// 	{
// 		const newColumn = typeof column === "string" ? new Column(column) : new Column(column.column, column.wrappedBy);
// 		this.groupByColumns.push(newColumn);
// 		return this;
// 	}
// 	orderBy(column: keyof Type | WrappedColumn<Type>, direction: "ASC" | "DESC" = "ASC")
// 	{
// 		const newColumn = typeof column === "string" ? new OrderByColumn(column, direction) : new OrderByColumn(column.column, direction, column.wrappedBy);
// 		this.orderByColumns.push(newColumn);
// 		return this;
// 	}
// 	limit(limit: number)
// 	{
// 		this.limitTo = limit;
// 		return this;
// 	}
// 	async getMany(databaseProvider: IDatabaseProvider): Promise<Pick<Type, SelectedColumn>[]>
// 	{
// 		const result = await databaseProvider.get(this.toSQL());
// 		// convert values, if column has converter functions
// 		result.forEach(tuple =>
// 		{
// 			// return Object.entries(tuple).reduce((acc, [column, value]) =>
// 			// {
// 			// 	const converter = this.table.columns[column as keyof Type].converter;
// 			// 	const convertedValue = converter && converter.toJS(value);
// 			// 	return { ...acc, [column]: convertedValue };
// 			// 	// return {...acc, [current[0]]: current[1] }), {})
// 			// 	// [column, value]
// 			// 	// if(converter)
// 			// 	// {
// 			// 	// }
// 			// }, {} as any);
// 			Object.entries(tuple).forEach(([column, value]) =>
// 			{
// 				const converter = this.table.columns[column as keyof Type].converter;
// 				if(converter)
// 				{
// 					tuple[column] = converter.toJS(value);
// 				}
// 			});
// 		});
// 		return result;
// 	}
// 	async getOne(databaseProvider: IDatabaseProvider): Promise<Pick<Type, SelectedColumn> | undefined>
// 	{
// 		return (await this.getMany(databaseProvider))[0];
// 	}
// 	private distinctToSQL()
// 	{
// 		return this.isDistinct ? "DISTINCT ": "";
// 	}
// 	private selectedColumnsToSQL()
// 	{
// 		return this.selectedColumns.length ? this.selectedColumns.join(", ") : "*";
// 	}
// 	private groupByToSQL()
// 	{
// 		return this.groupByColumns.length ? `GROUP BY ${this.groupByColumns.join(", ")}` : "";
// 	}
// 	private orderByToSQL()
// 	{
// 		return this.orderByColumns.length ? `ORDER BY ${this.orderByColumns.join(", ")}` : "";
// 	}
// 	private limitToSQL()
// 	{
// 		return this.limitTo ? `LIMIT ${this.limitTo}` : "";
// 	}
// 	toSQL()
// 	{
// 		let sqlParts: string[] =
// 		[
// 			`SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`,
// 			`FROM ${this.table.tableName}`,
// 			this.filtersToSQL(),
// 			this.groupByToSQL(),
// 			this.orderByToSQL(),
// 			this.limitToSQL()
// 		];
// 		// strip out null, undefined and empty strings
// 		// and concat strings with linebreak and some spaces
// 		return sqlParts
// 			.filter(Boolean) 
// 			.join("\n  ");
// 	}
// }
