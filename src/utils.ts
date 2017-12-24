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
	
	return value.toString();
}