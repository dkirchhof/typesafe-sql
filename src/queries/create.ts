import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";

export function createTable<Type>(table: Table<Type>)
{
	return new CreateQuery(table);
}

export type MappedType<Type> = { [K in keyof Type]: IColumnOptions<Type[K]> };
export type Action = "NO ACTION" | "RESTRICT" | "SET NULL" | "SET DEFAULT" | "CASCADE"

export interface IColumnOptions<Type>
{
	dataType: "TEXT" | "INT";
	primary?: boolean;
	foreign?: ForeignKey<any>
	notNull?: boolean;
	unique?: boolean;
	default?: Type;
}

export class ForeignKey<Type>
{
	constructor(public readonly table: Table<Type>, public readonly column: keyof Type, public readonly onDelete: Action = "NO ACTION", public readonly onUpdate: Action = "NO ACTION") { }
}

export class CreateQuery<Type>
{
	private columnList: string[] = [];
	private primaryList: string[] = [];
	private foreignList: string[] = [];

	constructor(private readonly table: Table<Type>) { }

	columns(columns: MappedType<Type>)
	{
		Object.keys(columns).forEach((column: keyof MappedType<Type>) =>
		{
			const columnOptions = columns[column];

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
				const table = columnOptions.foreign.table.tableName;
				const column = columnOptions.foreign.column;
				const onDelete = columnOptions.foreign.onDelete;
				const onUpdate = columnOptions.foreign.onUpdate;

				string += ` REFERENCES ${table}(${column}) ON DELETE ${onDelete} ON UPDATE ${onUpdate}`;
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

