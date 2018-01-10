"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("./queries/create");
const drop_1 = require("./queries/drop");
const insert_1 = require("./queries/insert");
const update_1 = require("./queries/update");
const delete_1 = require("./queries/delete");
class Table {
    constructor(tableName, columns) {
        this.tableName = tableName;
        Object.entries(columns).forEach(([key, value]) => value.columnName = key);
        this.columns = columns;
    }
    create() {
        return new create_1.CreateQuery(this);
    }
    drop() {
        return new drop_1.DropQuery(this);
    }
    insert(values) {
        return new insert_1.InsertQuery(this, values);
    }
    update(values) {
        return new update_1.UpdateQuery(this, values);
    }
    delete() {
        return new delete_1.DeleteQuery(this);
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map