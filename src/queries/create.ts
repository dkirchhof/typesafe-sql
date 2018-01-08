import { Table } from "../Table";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";

export class CreateQuery
{
	constructor(private readonly table: Table<any>) { }

	async execute(databaseProvider: IDatabaseProvider)
	{
		return databaseProvider.execute(this.toSQL());
	}

	toSQL()
	{
		const columns = Object.values(this.table.columns).map(column =>
		{
			let string = `${column.columnName} ${column.dataType}`;
			
			if(column.unique)
			{
				string += ` UNIQUE`
			}

			if(column.notNull)
			{
				string += ` NOT NULL`;
			}			

			if(column.foreign)
			{
				const foreignTable = column.foreign.table.tableName;
				const foreignColumn = column.foreign.column;
				const onDelete = column.foreign.onDelete;
				const onUpdate = column.foreign.onUpdate;

				string += ` REFERENCES ${foreignTable}(${foreignColumn}) ON DELETE ${onDelete} ON UPDATE ${onUpdate}`;
			}

			return string;
		});

		let primaryConstraint = "";
		const primaryColumns = Object.values(this.table.columns).filter(column => column.primary);	
		if(primaryColumns.length)
		{
			primaryConstraint = `,\n\tPRIMARY KEY (${primaryColumns.map(column => column.columnName).join(", ")})`;
		}

		return `CREATE TABLE ${this.table.tableName} (\n\t${columns.join(",\n\t")}${primaryConstraint}\n)`;
	}
}

