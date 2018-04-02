"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilterableQuery_1 = require("./FilterableQuery");
class SelectQuery extends FilterableQuery_1.FilterableQuery {
    constructor(table, selectedColumns) {
        super(table);
        this.aggregationColumns = [];
        this.groupByColumns = [];
        this.orderByColumns = [];
        this.selectedColumns = selectedColumns.map(column => ({ column }));
    }
    distinct() {
        this.isDistinct = true;
        return this;
    }
    wrapColumn(column, wrappedBy) {
        this.selectedColumns.find(c => c.column === column).wrappedBy = wrappedBy;
        return this;
    }
    groupBy(column) {
        this.groupByColumns.push(column);
        return this;
    }
    orderBy(column, direction = "ASC") {
        this.orderByColumns.push({ column, direction });
        return this;
    }
    limit(limit) {
        this.limitTo = limit;
        return this;
    }
    async getMany(databaseProvider) {
        return databaseProvider.get(this.toSQL());
    }
    async getOne(databaseProvider) {
        return (await this.getMany(databaseProvider))[0];
    }
    distinctToSQL() {
        return this.isDistinct ? "DISTINCT " : "";
    }
    columnsToSQL() {
        const map = (column) => {
            if (column.wrappedBy) {
                return `${column.wrappedBy[0]}${column.column}${column.wrappedBy[1]} AS ${column.column}`;
            }
            return column.column;
        };
        return this.selectedColumns.length ? this.selectedColumns.map(map).join(", ") : "*";
    }
    groupByToSQL() {
        return this.groupByColumns.length ? `GROUP BY ${this.groupByColumns.join(", ")}` : "";
    }
    orderByToSQL() {
        const map = (orderBy) => `${orderBy.column} ${orderBy.direction}`;
        return this.orderByColumns.length ? `ORDER BY ${this.orderByColumns.map(map).join(", ")}` : "";
    }
    limitToSQL() {
        return this.limitTo ? `LIMIT ${this.limitTo}` : "";
    }
    toSQL() {
        let sqlParts = [
            `SELECT ${this.distinctToSQL()}${this.columnsToSQL()}`,
            `FROM ${this.table.tableName}`,
            this.filtersToSQL(),
            this.groupByToSQL(),
            this.orderByToSQL(),
            this.limitToSQL()
        ];
        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
    }
}
exports.SelectQuery = SelectQuery;
