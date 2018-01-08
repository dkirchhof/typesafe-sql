"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
// todo: turn _attributes and _functions back to private
// when https://github.com/Microsoft/TypeScript/issues/17293 or https://github.com/Microsoft/TypeScript/issues/15058 is fixed
function from(table1, alias1, table2, alias2) {
    return new class {
        constructor(tablesAndAliases) {
            this._filters = [];
            this._joinFilters = [];
            this._groupByColumns = [];
            this._orderByColumns = [];
            this._sources = this._createSources(tablesAndAliases);
            this._record = this._createRecord(this._sources);
        }
        _createSources(sources) {
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
        _createRecord(sources) {
            const tempRecord = {};
            sources.forEach(source => tempRecord[source.tableAlias] = source.columns);
            return tempRecord;
        }
        aggregate(columnSelector, aggregationType) {
            const column = columnSelector(this._record);
            this._sources.find(source => source.tableAlias === column.tableAlias).columns[column.columnName].aggregation = aggregationType;
            return this;
        }
        where(columnSelector, value) {
            const column = columnSelector(this._record);
            this._filters.push({ column, value });
            return this;
        }
        joinOn(columnSelector1, columnSelector2) {
            const column1 = columnSelector1(this._record);
            const column2 = columnSelector2(this._record);
            this._joinFilters.push({ column1, column2 });
            return this;
        }
        groupBy(columnSelector) {
            const column = columnSelector(this._record);
            this._groupByColumns.push({ column });
            return this;
        }
        orderBy(columnSelector, direction = "ASC") {
            const column = columnSelector(this._record);
            this._orderByColumns.push({ column, direction });
            return this;
        }
        limit(limit) {
            this._limitTo = limit;
            return this;
        }
        select(keys1, keys2) {
            for (let i = 0; i < arguments.length; i++) {
                const keys = arguments[i];
                for (const key of keys) {
                    this._sources[i].columns[key].selected = true;
                }
            }
            return new class {
                constructor(_sources, _filters, _joinFilters, _groupByColumns, _orderByColumns, _limitTo) {
                    this._sources = _sources;
                    this._filters = _filters;
                    this._joinFilters = _joinFilters;
                    this._groupByColumns = _groupByColumns;
                    this._orderByColumns = _orderByColumns;
                    this._limitTo = _limitTo;
                }
                toSQL() {
                    const columns = this._sources.reduce((prev, current) => {
                        const mappedColumns = Object.values(current.columns)
                            .filter(column => column.selected)
                            .map(column => {
                            let computedColumnName = `${column.tableAlias}.${column.columnName}`;
                            if (column.aggregation) {
                                computedColumnName = `${column.aggregation}(${computedColumnName})`;
                            }
                            return `${computedColumnName} AS ${column.tableAlias}_${column.columnName}`;
                        });
                        return prev.concat(mappedColumns);
                    }, []);
                    const tables = this._sources.map(source => `${source.tableName} ${source.tableAlias}`);
                    let sql = `SELECT ${columns.join(", ")}\n\tFROM ${tables.join(", ")}`;
                    if (this._filters.length || this._joinFilters.length) {
                        const joinFilters = this._joinFilters.map(filter => `${filter.column1.tableAlias}.${filter.column1.columnName} = ${filter.column2.tableAlias}.${filter.column2.columnName}`);
                        const valueFilters = this._filters.map(filter => `${filter.column.tableAlias}.${filter.column.columnName} = ${utils_1.sanitizeValue(filter.value)}`);
                        const filters = joinFilters.concat(valueFilters);
                        sql = `${sql}\n\tWHERE ${filters.join(" AND ")}`;
                    }
                    if (this._groupByColumns.length) {
                        const groupByColumns = this._groupByColumns.map(groupBy => `${groupBy.column.tableAlias}.${groupBy.column.columnName}`);
                        sql = `${sql}\n\tGROUP BY ${groupByColumns.join(" ,")}`;
                    }
                    if (this._orderByColumns.length) {
                        const orderByColumns = this._orderByColumns.map(orderBy => `${orderBy.column.tableAlias}.${orderBy.column.columnName}`);
                        sql = `${sql}\n\tORDER BY ${orderByColumns.join(" ,")}`;
                    }
                    if (this._limitTo !== undefined) {
                        sql = `${sql}\n\tLIMIT ${this._limitTo}`;
                    }
                    return sql;
                }
                async execute(databaseProvider) {
                    const result = await databaseProvider.get(this.toSQL());
                    const mappedResult = result.map(item => {
                        const mappedItem = {};
                        this._sources.forEach(source => mappedItem[source.tableAlias] = {});
                        Object.entries(item).forEach(([key, value]) => {
                            const [, table, column] = key.match(/(.*)_(.*)/);
                            mappedItem[table][column] = value;
                        });
                        return mappedItem;
                    });
                    return mappedResult;
                }
            }(this._sources, this._filters, this._joinFilters, this._groupByColumns, this._orderByColumns, this._limitTo);
        }
    }(arguments);
}
exports.from = from;
//# sourceMappingURL=select.js.map