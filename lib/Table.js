"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("./queries/create");
const delete_1 = require("./queries/delete");
const drop_1 = require("./queries/drop");
const insert_1 = require("./queries/insert");
const select_1 = require("./queries/select");
const update_1 = require("./queries/update");
class ForeignKey {
    constructor(table, column, onDelete, onUpdate) {
        this.table = table;
        this.column = column;
        this.onDelete = onDelete;
        this.onUpdate = onUpdate;
    }
}
exports.ForeignKey = ForeignKey;
class Table {
    // public readonly columns: ColumnOptions<Type>;
    constructor(tableName, columns) {
        this.tableName = tableName;
        this.columns = columns;
        // Object.entries(columns as ExtendedMappedTable<any>).forEach(([key, value]) => value.columnName = key);
        // this.columns = columns;
    }
    create() {
        return new create_1.CreateQuery(this);
    }
    drop() {
        return new drop_1.DropQuery(this);
    }
    query(alias) {
        return new select_1.SelectQuery(this, alias);
    }
    insert(tuples) {
        return new insert_1.InsertQuery(this, tuples);
    }
    update(values) {
        return new update_1.UpdateQuery(this, values);
    }
    delete() {
        return new delete_1.DeleteQuery(this);
    }
}
exports.Table = Table;
