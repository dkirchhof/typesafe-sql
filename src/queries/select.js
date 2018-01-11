"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
// waiting for https://github.com/Microsoft/TypeScript/issues/17293 or https://github.com/Microsoft/TypeScript/issues/15058
function from(table1, alias1, table2, alias2) {
    return new class {
        constructor(tablesAndAliases) {
            this.filters = [];
            this.groupByColumns = [];
            this.orderByColumns = [];
            this.sources = this.createSources(tablesAndAliases);
            this.record = this.createRecord(this.sources);
        }
        createSources(sources) {
            let tempSources = [];
            for (let i = 0; i < sources.length; i += 2) {
                const table = sources[i];
                const alias = sources[i + 1];
                // copy columns object
                const columnsCopy = JSON.parse(JSON.stringify(table.columns));
                // set tableAlias for each column
                Object.values(columnsCopy).forEach(column => column.tableAlias = alias);
                // return mapped source
                tempSources.push({ tableName: table.tableName, tableAlias: alias, columns: columnsCopy });
            }
            return tempSources;
        }
        createRecord(sources) {
            const tempRecord = {};
            sources.forEach(source => tempRecord[source.tableAlias] = source.columns);
            return tempRecord;
        }
        aggregate(columnSelector, aggregationType) {
            const column = columnSelector(this.record);
            this.sources.find(source => source.tableAlias === column.tableAlias).columns[column.columnName].aggregation = aggregationType;
            return this;
        }
        where(columnSelector, valueOrColumnSelector) {
            const column = columnSelector(this.record);
            if (typeof valueOrColumnSelector === "function") {
                this.filters.push({ column, valueOrColumn: valueOrColumnSelector(this.record) });
            }
            else {
                this.filters.push({ column, valueOrColumn: valueOrColumnSelector });
            }
            return this;
        }
        groupBy(columnSelector) {
            const column = columnSelector(this.record);
            this.groupByColumns.push({ column });
            return this;
        }
        orderBy(columnSelector, direction = "ASC") {
            const column = columnSelector(this.record);
            this.orderByColumns.push({ column, direction });
            return this;
        }
        limit(limit) {
            this.limitTo = limit;
            return this;
        }
        select(keys1, keys2) {
            for (let i = 0; i < arguments.length; i++) {
                const keys = arguments[i];
                if (!keys.length) {
                    Object.values(this.sources[i].columns).forEach(column => column.selected = true);
                }
                else {
                    for (const key of keys) {
                        this.sources[i].columns[key].selected = true;
                    }
                }
            }
            return new class {
                constructor(sources, filters, groupByColumns, orderByColumns, limitTo) {
                    this.sources = sources;
                    this.filters = filters;
                    this.groupByColumns = groupByColumns;
                    this.orderByColumns = orderByColumns;
                    this.limitTo = limitTo;
                }
                toSQL() {
                    const columns = this.sources.reduce((prev, current) => {
                        const mappedColumns = Object.values(current.columns)
                            .filter(column => column.selected)
                            .map(column => {
                            let computedColumnName = utils_1.columnToString(column);
                            if (column.aggregation) {
                                computedColumnName = `${column.aggregation}(${computedColumnName})`;
                            }
                            return `${computedColumnName} AS ${column.tableAlias}_${column.columnName}`;
                        });
                        return prev.concat(mappedColumns);
                    }, []);
                    const tables = this.sources.map(source => `${source.tableName} AS ${source.tableAlias}`);
                    let sql = `SELECT ${columns.join(", ")}\n\tFROM ${tables.join(", ")}`;
                    if (this.filters.length) {
                        const filters = this.filters.map(filter => `${utils_1.columnToString(filter.column)} = ${utils_1.sanitizeValue(filter.valueOrColumn)}`);
                        sql = `${sql}\n\tWHERE ${filters.join(" AND ")}`;
                    }
                    if (this.groupByColumns.length) {
                        const groupByColumns = this.groupByColumns.map(groupBy => utils_1.columnToString(groupBy.column));
                        sql = `${sql}\n\tGROUP BY ${groupByColumns.join(" ,")}`;
                    }
                    if (this.orderByColumns.length) {
                        const orderByColumns = this.orderByColumns.map(orderBy => utils_1.columnToString(orderBy.column));
                        sql = `${sql}\n\tORDER BY ${orderByColumns.join(" ,")}`;
                    }
                    if (this.limitTo !== undefined) {
                        sql = `${sql}\n\tLIMIT ${this.limitTo}`;
                    }
                    return sql;
                }
                async execute(databaseProvider) {
                    const result = await databaseProvider.get(this.toSQL());
                    const mappedResult = result.map(item => {
                        const mappedItem = {};
                        this.sources.forEach(source => mappedItem[source.tableAlias] = {});
                        Object.entries(item).forEach(([key, value]) => {
                            const [, table, column] = key.match(/(.*)_(.*)/);
                            mappedItem[table][column] = value;
                        });
                        return mappedItem;
                    });
                    return mappedResult;
                }
            }(this.sources, this.filters, this.groupByColumns, this.orderByColumns, this.limitTo);
        }
    }(arguments);
}
exports.from = from;
