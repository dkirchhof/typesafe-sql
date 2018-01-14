import { IExtendedColumnOptions } from "./Table";

export function sanitizeValue(value: any): string | null
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
	const fullName = `${column.tableAlias}.${column.columnName}`;
	 
	if(column.wrappedBy)
	{
		return `${column.wrappedBy[0]}${fullName}${column.wrappedBy[1]}`;
	}
	else
	{
		return fullName;
	}
}

export function isColumn(column: any): column is IExtendedColumnOptions<any>
{
	return (<IExtendedColumnOptions<any>>column).dataType !== undefined;
}

export function wrappedColumn<T>(strings: TemplateStringsArray, column: IExtendedColumnOptions<T>): IExtendedColumnOptions<T>
{
	const copy = JSON.parse(JSON.stringify(column));
	copy.wrappedBy = [...strings];
	return copy;
}