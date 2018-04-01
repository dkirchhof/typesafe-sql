import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";
import { convertValue } from "..";
import { Operator } from "../Operator";
import { Filter } from "../Filter";
import { FilterableQuery } from "./FilterableQuery";

type OrderBy<Type> = { column: keyof Type; direction: "ASC" | "DESC" }

export class SelectQuery<Type, SelectedColumns extends keyof Type> extends FilterableQuery<Type>
{   
	private isDistinct: boolean;
	private groupByColumns: (keyof Type)[] = [];
	private orderByColumns: OrderBy<Type>[] = [];
	private limitTo: number;

    constructor(table: Table<Type>, private columns: SelectedColumns[])
    { 
        super(table);
	}
	
	distinct()
	{
		this.isDistinct = true;
		return this;
	}

	// aggregate(columnSelector: mappedRecordsPredicate<any>, aggregationType: AggregationType): this
	// {
	// 	const column = columnSelector(this.record);
	// 	this.sources.find(source => source.tableAlias === column.tableAlias)!.columns[column.columnName!].aggregation = aggregationType;

	// 	return this;
	// }

	groupBy(column: keyof Type)
	{
		this.groupByColumns.push(column);
		return this;
	}

	orderBy(column: keyof Type, direction: "ASC" | "DESC" = "ASC")
	{
		this.orderByColumns.push({ column, direction });
		return this;
	}

	limit(limit: number)
	{
		this.limitTo = limit;
		return this;
	}
    
	async getMany(databaseProvider: IDatabaseProvider): Promise<Pick<Type, SelectedColumns>[]>
	{
		return databaseProvider.get(this.toSQL());
	}

	async getOne(databaseProvider: IDatabaseProvider): Promise<Pick<Type, SelectedColumns> | undefined>
	{
		return (await this.getMany(databaseProvider))[0];
	}

	private distinctToSQL()
	{
		return this.isDistinct ? "DISTINCT ": "";
	}

	private columnsToSQL()
	{
		return this.columns.length ? this.columns.join(", ") : "*";
	}

	private groupByToSQL()
	{
		return this.groupByColumns.length ? `GROUP BY ${this.groupByColumns.join(" ,")}` : "";
	}

	private orderByToSQL()
	{
		const map = (orderBy: OrderBy<Type>) => `${orderBy.column} ${orderBy.direction}`;

		return this.orderByColumns.length ? `ORDER BY ${this.orderByColumns.map(map).join(" ,")}` : "";
	}
			
	private limitToSQL()
	{
		return this.limitTo ? `LIMIT ${this.limitTo}` : "";
	}

	toSQL()
	{
		let sqlParts: string[] =
		[
			`SELECT ${this.distinctToSQL()}${this.columnsToSQL()}`,
			`FROM ${this.table.tableName}`,
			this.filtersToSQL(),
			this.groupByToSQL(),
			this.orderByToSQL(),
			this.limitToSQL()
		];

		// strip out null, undefined and empty strings
		// and concat strings with linebreak and some spaces
		return sqlParts
			.filter(Boolean) 
			.join("\n  ");
	}
}