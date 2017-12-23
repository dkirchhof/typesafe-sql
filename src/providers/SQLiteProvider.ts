import { IDatabaseProvider } from "./IDatabaseProvider";
import { Database } from "sqlite";

export class SQLiteProvider implements IDatabaseProvider
{
	constructor(private db: Database) { }
	
	async get(sql: string)
	{
		return this.db.all(sql);
	}

	async execute(sql: string): Promise<any>
	{
		return this.db.run(sql);
	}
}