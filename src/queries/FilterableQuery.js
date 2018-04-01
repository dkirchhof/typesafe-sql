"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseQuery_1 = require("./BaseQuery");
class FilterableQuery extends BaseQuery_1.BaseQuery {
    constructor() {
        super(...arguments);
        this.filters = [];
    }
    where(filterOrColumn, value) {
        if (typeof filterOrColumn === "object") {
            this.filters.push(Object.assign({ operator: "=" }, filterOrColumn));
        }
        else {
            this.filters.push({ operator: "=", column: filterOrColumn, value: value });
        }
        return this;
    }
    filtersToSQL() {
        if (!this.filters.length) {
            return "";
        }
        const filters = this.filters
            .map(filter => `${filter.column} ${filter.operator} ${filter.value}`)
            .join(" AND ");
        return `WHERE ${filters}`;
    }
}
exports.FilterableQuery = FilterableQuery;
