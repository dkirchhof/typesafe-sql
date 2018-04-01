"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilterableQuery_1 = require("./FilterableQuery");
class SelectQuery extends FilterableQuery_1.FilterableQuery {
    constructor(table, columns) {
        super(table);
        this.columns = columns;
        this.groupByColumns = [];
        this.orderByColumns = [];
    }
    distinct() {
        this.isDistinct = true;
        return this;
    }
    // aggregate(columnSelector: mappedRecordsPredicate<any>, aggregationType: AggregationType): this
    // {
    // 	const column = columnSelector(this.record);
    // 	this.sources.find(source => source.tableAlias === column.tableAlias)!.columns[column.columnName!].aggregation = aggregationType;
    // 	return this;
    // }
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
        return this.columns.length ? this.columns.join(", ") : "*";
    }
    groupByToSQL() {
        return this.groupByColumns.length ? `GROUP BY ${this.groupByColumns.join(" ,")}` : "";
    }
    orderByToSQL() {
        const map = (orderBy) => `${orderBy.column} ${orderBy.direction}`;
        return this.orderByColumns.length ? `ORDER BY ${this.orderByColumns.map(map).join(" ,")}` : "";
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
