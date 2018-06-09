"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Column_1 = require("../Column");
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
class Join {
    constructor(joinMode, source, leftColumn, operator, rightColumn) {
        this.joinMode = joinMode;
        this.source = source;
        this.leftColumn = leftColumn;
        this.operator = operator;
        this.rightColumn = rightColumn;
    }
    toString() {
        return `${this.joinMode} JOIN ${this.source} ON ${this.leftColumn} ${this.operator} ${this.rightColumn}`;
    }
}
class SelectQuery {
    constructor(table, alias) {
        this.record = {}; // MappedRecord<RecordType>;
        this.joins = [];
        this.selectedColumns = [];
        this.filterColumns = [];
        this.groupByColumns = [];
        this.orderByColumns = [];
        this.source = new Source(table, alias);
        this.updateRecord(table, alias);
    }
    join(joinMode, table, alias, leftSelector, operator, rightSelector) {
        this.updateRecord(table, alias);
        const getColumn = (selector) => {
            const selected = selector(this.record);
            if (utils_1.isColumn(selected)) {
                return new Column_1.Column(selected);
            }
            else if (utils_1.isWrappedColum(selected)) {
                return new Column_1.Column(selected.column, selected.wrappedBy);
            }
        };
        const leftColumn = getColumn(leftSelector);
        const rightColumn = getColumn(rightSelector);
        this.joins.push(new Join(joinMode, new Source(table, alias), leftColumn, operator, rightColumn));
        return this;
    }
    where(selector, operator = "=", valueOrColumnSelector /*| mappedRecordsPredicate<T>*/) {
        const column = selector(this.record);
        if (utils_1.isColumn(column)) {
            this.filterColumns.push(new Column_1.FilterColumn(column, operator, valueOrColumnSelector));
        }
        else if (utils_1.isWrappedColum(column)) {
            this.filterColumns.push(new Column_1.FilterColumn(column.column, operator, valueOrColumnSelector, column.wrappedBy));
        }
        // if (typeof valueOrColumnSelector === "function") {
        //     this.filters.push({ column, valueOrColumn: valueOrColumnSelector(this.record), operator });
        // } else {
        // this.filters.push({ column, operator, valueOrColumn: valueOrColumnSelector });
        // }
        return this;
    }
    groupBy(selector) {
        const column = selector(this.record);
        if (utils_1.isColumn(column)) {
            this.groupByColumns.push(new Column_1.Column(column));
        }
        else if (utils_1.isWrappedColum(column)) {
            this.groupByColumns.push(new Column_1.Column(column.column, column.wrappedBy));
        }
        return this;
    }
    orderBy(selector, direction = "ASC") {
        const column = selector(this.record);
        if (utils_1.isColumn(column)) {
            this.orderByColumns.push(new Column_1.OrderByColumn(column, direction));
        }
        else if (utils_1.isWrappedColum(column)) {
            this.orderByColumns.push(new Column_1.OrderByColumn(column.column, direction, column.wrappedBy));
        }
        return this;
    }
    limit(limit) {
        this.limitTo = limit;
        return this;
    }
    select(mapper) {
        const resultSetSchema = mapper(this.record);
        this.resultSetMapper = mapper;
        this.selectedColumns = this.getSelectedColumns(resultSetSchema);
        return new ExecutableSelectQuery(this.record, this.resultSetMapper, this.source, this.joins, this.selectedColumns, this.filterColumns, this.groupByColumns, this.orderByColumns, this.isDistinct, this.limitTo);
    }
    selectAll() {
        // to select all, the mapper just takes the record and returns it, as it is
        return this.select(r => r);
    }
    updateRecord(table, alias) {
        // copy each column of the table
        // add tableAlias property to the column
        // add a copy of whole columns object to the record
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
    constructor(record, resultSetMapper, source, joins, selectedColumns, filterColumns, groupByColumns, orderByColumns, isDistinct, limitTo) {
        this.record = record;
        this.resultSetMapper = resultSetMapper;
        this.source = source;
        this.joins = joins;
        this.selectedColumns = selectedColumns;
        this.filterColumns = filterColumns;
        this.groupByColumns = groupByColumns;
        this.orderByColumns = orderByColumns;
        this.isDistinct = isDistinct;
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
            this.sourceToSQL(),
            this.joinsToSQL(),
            this.filtersToSQL(),
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
    sourceToSQL() {
        return `FROM ${this.source}`;
    }
    joinsToSQL() {
        return this.joins.join("\n");
    }
    distinctToSQL() {
        return this.isDistinct ? "DISTINCT " : "";
    }
    selectedColumnsToSQL() {
        return this.selectedColumns.join(", ");
    }
    filtersToSQL() {
        return this.filterColumns.length ? `WHERE ${this.filterColumns.join(" AND ")}` : "";
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
