"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteProvider = void 0;
class SQLiteProvider {
    db;
    constructor(db) {
        this.db = db;
    }
    async get(sql) {
        return this.db.all(sql);
    }
    async execute(sql) {
        return this.db.run(sql);
    }
}
exports.SQLiteProvider = SQLiteProvider;
