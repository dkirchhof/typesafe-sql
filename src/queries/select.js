"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Column_1 = require("../Column");
const Table_1 = require("../Table");
const utils_1 = require("../utils");
class Source {
    constructor(table, alias) {
        this.table = table;
        this.alias = alias;
    }
    toString() {
        return `${this.table.tableName} AS ${this.alias}`;
    }
}
class SelectQuery {
    constructor(table, alias) {
        this.record = {}; // MappedRecord<RecordType>;
        this.sources = [];
        this.selectedColumns = [];
        this.groupByColumns = [];
        this.orderByColumns = [];
        this.addSource(table, alias);
    }
    groupBy(selector) {
        const column = selector(this.record);
        this.groupByColumns.push(new Column_1.Column(column));
        return this;
    }
    orderBy(selector, direction = "ASC") {
        const column = selector(this.record);
        this.orderByColumns.push(new Column_1.OrderByColumn(column, direction));
        return this;
    }
    limit(limit) {
        this.limitTo = limit;
        return this;
    }
    join(table, alias) {
        this.addSource(table, alias);
        return this;
    }
    select(mapper) {
        const resultSetSchema = mapper(this.record);
        this.resultSetMapper = mapper;
        this.selectedColumns = this.getSelectedColumns(resultSetSchema);
        return new ExecutableSelectQuery(this.record, this.resultSetMapper, this.sources, this.selectedColumns, this.isDistinct, this.groupByColumns, this.orderByColumns, this.limitTo);
    }
    addSource(table, alias) {
        this.sources.push(new Source(table, alias));
        this.record[alias] =
            Object.entries(table.columns)
                .reduce((prev, [key, value]) => (Object.assign({}, prev, { [key]: Object.assign({}, value, { tableAlias: alias }) })), {});
    }
    getSelectedColumns(resultSetSchema, columns = [], path = "") {
        Object.entries(resultSetSchema).forEach(([key, value]) => {
            if (utils_1.isColumn(value)) {
                columns.push(new Column_1.ProjectionColumn(value, `${path}${key}`));
            }
            else if (utils_1.isWrappedColum(value)) {
                columns.push(new Column_1.ProjectionColumn(value.column, `${path}${key}`, value.wrappedBy));
            }
            else if (typeof value === "object") {
                this.getSelectedColumns(value, columns, `${path}${key}_`);
            }
        });
        return columns;
    }
}
exports.SelectQuery = SelectQuery;
class ExecutableSelectQuery {
    constructor(record, resultSetMapper, sources, selectedColumns, isDistinct, groupByColumns, orderByColumns, limitTo) {
        this.record = record;
        this.resultSetMapper = resultSetMapper;
        this.sources = sources;
        this.selectedColumns = selectedColumns;
        this.isDistinct = isDistinct;
        this.groupByColumns = groupByColumns;
        this.orderByColumns = orderByColumns;
        this.limitTo = limitTo;
    }
    getOne() {
        const resultSetSchema = this.resultSetMapper(this.record);
        const result = { min: 1, max: 1384 };
        this.fillResultSet(resultSetSchema, result);
        return resultSetSchema;
    }
    getMany() {
        return {};
    }
    toSQL() {
        const sqlParts = [
            `SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`,
            this.sourcesToSQL(),
            // this.filtersToSQL(),
            this.groupByToSQL(),
            this.orderByToSQL(),
            this.limitToSQL(),
        ];
        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
    }
    fillResultSet(resultSetSchema, result) {
        Object.entries(resultSetSchema).forEach(([key, value]) => {
            if (utils_1.isColumn(value) || utils_1.isWrappedColum(value)) {
                resultSetSchema[key] = result[key];
            }
            else if (typeof value === "object") {
                this.fillResultSet(value, result);
            }
        });
    }
    // region string methods
    sourcesToSQL() {
        return `FROM ${this.sources.join(", ")}`;
    }
    distinctToSQL() {
        return this.isDistinct ? "DISTINCT " : "";
    }
    selectedColumnsToSQL() {
        return this.selectedColumns.join(", ");
    }
    groupByToSQL() {
        return this.groupByColumns.length ? `GROUP BY ${this.groupByColumns.join(", ")}` : "";
    }
    orderByToSQL() {
        return this.orderByColumns.length ? `ORDER BY ${this.orderByColumns.join(", ")}` : "";
    }
    limitToSQL() {
        return this.limitTo ? `LIMIT ${this.limitTo}` : "";
    }
}
function wrap(strings, column) {
    return { column, wrappedBy: [strings[0], strings[1]] };
}
exports.wrap = wrap;
const personTable = new Table_1.Table("persons", {
    firstname: { dataType: "TEXT" },
    id: { dataType: "INTEGER", primary: true },
    lastname: { dataType: "TEXT" },
});
