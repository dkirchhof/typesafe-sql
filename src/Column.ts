export class Column
{
	constructor(public readonly column: string, protected wrappedBy?: string[]) { }

	wrap(before: string, after: string)
	{
		this.wrappedBy = [before, after];
	}

	toString()
	{
		if(this.wrappedBy)
		{
			return `${this.wrappedBy[0]}${this.column}${this.wrappedBy[1]}`;
		}
		
		return this.column;
	}
}

export class ProjectionColumn extends Column
{
	toString()
	{
		const alias = this.wrappedBy ? ` AS ${this.column}` : "";
		return `${super.toString()}${alias}`;
	}
}

export class OrderByColumn extends Column
{
	constructor(column: string, private direction: "ASC" | "DESC", wrappedBy?: string[])
	{
		super(column, wrappedBy);
	}

	toString()
	{
		return `${super.toString()} ${this.direction}`;
	}
}