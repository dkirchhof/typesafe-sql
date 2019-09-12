import { Database } from "sqlite";
import { IDatabaseProvider } from "./IDatabaseProvider";
export declare class SQLiteProvider implements IDatabaseProvider {
    private db;
    constructor(db: Database);
    get(sql: string): Promise<any[]>;
    execute(sql: string): Promise<any>;
}
