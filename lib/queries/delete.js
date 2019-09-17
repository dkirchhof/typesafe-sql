"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Column_1 = require("../Column");
const Source_1 = require("../Source");
function deleteFrom(table) {
    return new DeleteQuery(table);
}
exports.deleteFrom = deleteFrom;
class DeleteQuery {
    constructor(table) {
        this.wheres = [];
        this.source = new Source_1.Source(table);
        this.columns = Object.entries(table.columns)
            .reduce((prev, [columnName, columnOptions]) => ({ ...prev, [columnName]: new Column_1.Column(columnName, columnOptions) }), {});
    }
    where(predicateFactory) {
        const predicate = predicateFactory(this.columns);
        this.wheres.push(predicate);
        return this;
    }
    async execute(databaseProvider) {
        const { changes } = await databaseProvider.execute(this.toSQL());
        return changes;
    }
    toSQL() {
        const sqlParts = [
            this.deleteToSQL(),
            this.wheresToSQL(),
        ];
        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
    }
    // region string methods
    deleteToSQL() {
        return `DELETE FROM ${this.source}`;
    }
    wheresToSQL() {
        return this.wheres.length ? `WHERE ${this.wheres.join(" AND ")}` : "";
    }
}
