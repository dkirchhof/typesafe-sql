import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";

export function createTable<Type>(table: Table<Type>)
{
	return new CreateQuery(table);
}

type MappedType<T> = { [K in keyof T]: IColumnOptions };

interface IColumnOptions
{
	dataType: "TEXT" | "INT";
	primary?: boolean;
	foreign?: ForeignKey<any>
	notNull?: boolean;
	unique?: boolean;
}

export class ForeignKey<Type>
{
	constructor(public readonly table: Table<Type>, public readonly column: keyof Type) { }
}

class CreateQuery<Type>
{
	private columnList: string[] = [];
	private primaryList: string[] = [];
	private foreignList: string[] = [];

	constructor(private readonly table: Table<Type>) { }

	columns(columns: MappedType<Type>)
	{
		Object.keys(columns).forEach(column =>
		{
			const columnOptions: IColumnOptions = (<any>columns)[column];

			let string = `${column} ${columnOptions.dataType}`;
			
			if(columnOptions.unique !== undefined)
			{
				string += ` UNIQUE`
			}

			if(columnOptions.notNull !== undefined)
			{
				string += ` NOT NULL`;
			}			

			if(columnOptions.foreign !== undefined)
			{
				string += ` REFERENCES ${columnOptions.foreign.table.tableName}(${columnOptions.foreign.column})`;
			}

			this.columnList.push(string);
			
			if(columnOptions.primary)
			{
				this.primaryList.push(column);
			}
		});

		return this;
	}

	async execute(databaseProvider: IDatabaseProvider)
	{
		return databaseProvider.execute(this.toSQL());
	}

	toSQL()
	{
		let primaryConstraint = "";

		if(this.primaryList.length)
		{
			primaryConstraint = `, PRIMARY KEY (${this.primaryList.join(", ")})`;
		}

		return `CREATE TABLE ${this.table.tableName} (${this.columnList.join(", ")}${primaryConstraint})`;
	}
}

