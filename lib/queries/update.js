"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Column_1 = require("../Column");
const Source_1 = require("../Source");
const utils_1 = require("../utils");
function update(table) {
    return new UpdateQuery(table);
}
exports.update = update;
class UpdateQuery {
    constructor(table) {
        this.table = table;
    }
    set(values) {
        return new ExecutableUpdateQuery(this.table, values);
    }
}
class ExecutableUpdateQuery {
    constructor(table, values) {
        this.values = values;
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
            this.updateToSQL(),
            this.setValuesToSQL(),
            this.wheresToSQL(),
        ];
        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
    }
    // region string methods
    updateToSQL() {
        return `UPDATE ${this.source}`;
    }
    setValuesToSQL() {
        const values = Object.entries(this.values).map(([columnName, value]) => {
            const { converter } = this.source.table.columns[columnName];
            const convertedValue = converter ? converter.toDB(value) : value;
            const sanitizedValue = utils_1.sanitizeValue(convertedValue);
            return `${columnName} = ${sanitizedValue}`;
        }).join(", ");
        return `SET ${values}`;
    }
    wheresToSQL() {
        return this.wheres.length ? `WHERE ${this.wheres.join(" AND ")}` : "";
    }
}
