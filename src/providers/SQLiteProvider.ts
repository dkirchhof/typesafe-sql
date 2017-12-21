import { IDatabaseProvider } from "./IDatabaseProvider";
import { Database } from "sqlite";

export class SQLiteProvider implements IDatabaseProvider
{
	constructor(private db: Database) { }
	
	async get(sql: string)
	{
		return this.db.all(sql);
	}

	async execute(sql: string)
	{
		return this.db.run(sql);
	}
}