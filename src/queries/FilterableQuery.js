"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const BaseQuery_1 = require("./BaseQuery");
class FilterableQuery extends BaseQuery_1.BaseQuery {
    constructor() {
        super(...arguments);
        this.filters = [];
    }
    where(column, operator, value) {
        this.filters.push({ column, operator, value });
        return this;
    }
    filtersToSQL() {
        const map = (filter) => {
            const columnOptions = this.table.columns[filter.column];
            let value;
            if (Array.isArray(filter.value)) {
                const list = filter.value.map(v => __1.sanitizeValue(__1.convertValue(columnOptions, v)));
                value = `(${list.join(", ")})`;
            }
            else {
                value = __1.sanitizeValue(__1.convertValue(columnOptions, filter.value));
            }
            return `${filter.column} ${filter.operator} ${value}`;
        };
        return this.filters.length ? `WHERE ${this.filters.map(map).join(" AND ")}` : "";
    }
}
exports.FilterableQuery = FilterableQuery;
