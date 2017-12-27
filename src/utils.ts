export function sanitizeValue(value: any)
{
	if(typeof value === "string")
	{
		return `"${value}"`;
	}
	if(value instanceof Date)
	{
		return `"${value.toISOString()}"`;
	}
	if(value !== undefined && value !== null)
	{
		return value.toString();
	}

	return null;
}