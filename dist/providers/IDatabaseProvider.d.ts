export interface IDatabaseProvider {
    get(sql: string): Promise<any[]>;
    execute(sql: string): Promise<{
        changes: number;
        lastID: number;
    }>;
}
