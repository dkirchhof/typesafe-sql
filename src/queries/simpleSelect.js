"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilterableQuery_1 = require("./FilterableQuery");
const Column_1 = require("../Column");
class SelectQuery extends FilterableQuery_1.FilterableQuery {
    constructor(table, selectedColumns) {
        super(table);
        this.groupByColumns = [];
        this.orderByColumns = [];
        this.selectedColumns = selectedColumns.map(column => new Column_1.ProjectionColumn(column));
    }
    distinct() {
        this.isDistinct = true;
        return this;
    }
    wrapColumn(column, before, after) {
        this.selectedColumns.find(c => c.column === column).wrap(before, after);
        return this;
    }
    aggregate(column, aggregation) {
        return this.wrapColumn(column, `${aggregation}(`, `)`);
    }
    groupBy(column) {
        const newColumn = typeof column === "string" ? new Column_1.Column(column) : new Column_1.Column(column.column, column.wrappedBy);
        this.groupByColumns.push(newColumn);
        return this;
    }
    orderBy(column, direction = "ASC") {
        const newColumn = typeof column === "string" ? new Column_1.OrderByColumn(column, direction) : new Column_1.OrderByColumn(column.column, direction, column.wrappedBy);
        this.orderByColumns.push(newColumn);
        return this;
    }
    limit(limit) {
        this.limitTo = limit;
        return this;
    }
    async getMany(databaseProvider) {
        const result = await databaseProvider.get(this.toSQL());
        // convert values, if column has converter functions
        result.forEach(tuple => {
            // return Object.entries(tuple).reduce((acc, [column, value]) =>
            // {
            // 	const converter = this.table.columns[column as keyof Type].converter;
            // 	const convertedValue = converter && converter.toJS(value);
            // 	return { ...acc, [column]: convertedValue };
            // 	// return {...acc, [current[0]]: current[1] }), {})
            // 	// [column, value]
            // 	// if(converter)
            // 	// {
            // 	// }
            // }, {} as any);
            Object.entries(tuple).forEach(([column, value]) => {
                const converter = this.table.columns[column].converter;
                if (converter) {
                    tuple[column] = converter.toJS(value);
                }
            });
        });
        return result;
    }
    async getOne(databaseProvider) {
        return (await this.getMany(databaseProvider))[0];
    }
    distinctToSQL() {
        return this.isDistinct ? "DISTINCT " : "";
    }
    selectedColumnsToSQL() {
        return this.selectedColumns.length ? this.selectedColumns.join(", ") : "*";
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
    toSQL() {
        let sqlParts = [
            `SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`,
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
