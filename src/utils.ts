import { IExtendedColumnOptions } from "./Table";

export function sanitizeValue(value: any)
{
	if(typeof value === "string")
	{
		return `"${value}"`;
	}
	else if(value instanceof Date)
	{
		return `"${value.toISOString()}"`;
	}
	else if(isColumn(value))
	{
		return columnToString(value);
	}
	else if(value !== undefined && value !== null)
	{
		return value.toString();
	}

	return null;
}

export function columnToString(column: IExtendedColumnOptions<any>)
{
	return `${column.tableAlias}.${column.columnName}`;
}

export function isColumn(column: any): column is IExtendedColumnOptions<any>
{
	return (<IExtendedColumnOptions<any>>column).dataType !== undefined;
}