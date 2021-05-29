"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.ForeignKey = exports.PrimaryKey = exports.KeyConstraint = void 0;
const utils_1 = require("./utils");
class KeyConstraint {
    myColumns;
    constructor(columns) {
        this.myColumns = utils_1.toArray(columns);
    }
}
exports.KeyConstraint = KeyConstraint;
class PrimaryKey extends KeyConstraint {
    toString() {
        return `PRIMARY KEY (${this.myColumns.join(", ")})`;
    }
}
exports.PrimaryKey = PrimaryKey;
class ForeignKey extends KeyConstraint {
    onDelete;
    onUpdate;
    referencedTable;
    referencedColumns;
    constructor(myColumns, tableSelector, referencedColumns, onDelete = "NO ACTION", onUpdate = "NO ACTION") {
        super(myColumns);
        this.onDelete = onDelete;
        this.onUpdate = onUpdate;
        this.referencedTable = tableSelector; //();
        this.referencedColumns = utils_1.toArray(referencedColumns);
    }
    toString() {
        return `FOREIGN KEY (${this.myColumns.join(", ")}) REFERENCES ${this.referencedTable.tableName}(${this.referencedColumns.join(", ")}) ON DELETE ${this.onDelete} ON UPDATE ${this.onUpdate}`;
    }
}
exports.ForeignKey = ForeignKey;
class Table {
    tableName;
    columns;
    constraints;
    constructor(tableName, columns, constraints = []) {
        this.tableName = tableName;
        this.columns = columns;
        this.constraints = constraints;
    }
}
exports.Table = Table;
