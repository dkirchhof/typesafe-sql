import { Database } from "sqlite";
import { IDatabaseProvider } from "./IDatabaseProvider";

export class SQLiteProvider implements IDatabaseProvider {
    constructor(private db: Database) { }

    public async get(sql: string) {
        return this.db.all(sql);
    }

    public async execute(sql: string): Promise<any> {
        return this.db.run(sql);
    }
}
