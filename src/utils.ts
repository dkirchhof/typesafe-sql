export function sanitizeValue(value: any)
{
	if(typeof value === "string")
	{
		return `"${value}"`;
	}
	
	return value.toString();
}