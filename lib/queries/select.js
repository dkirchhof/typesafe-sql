"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Column_1 = require("../Column");
const GroupBy_1 = require("../GroupBy");
const Join_1 = require("../Join");
const OrderBy_1 = require("../OrderBy");
const Projection_1 = require("../Projection");
const Source_1 = require("../Source");
function from(table, alias) {
    return new SelectQuery(table, alias);
}
exports.from = from;
class SelectQuery {
    constructor(table, alias) {
        this.record = {}; // RecordType = { };
        this.joins = [];
        this.wheres = [];
        this.havings = [];
        this.groupBys = [];
        this.orderBys = [];
        this.source = new Source_1.AliasedSource(table, alias);
        this.updateRecord(table, alias);
    }
    join(joinMode, table, alias, predicateFactory) {
        this.updateRecord(table, alias);
        const predicate = predicateFactory(this.record);
        this.joins.push(new Join_1.Join(joinMode, new Source_1.AliasedSource(table, alias), predicate));
        return this;
    }
    where(predicateFactory) {
        const predicate = predicateFactory(this.record);
        this.wheres.push(predicate);
        return this;
    }
    having(predicateFactory) {
        const predicate = predicateFactory(this.record);
        this.havings.push(predicate);
        return this;
    }
    groupBy(columnSelector) {
        const column = columnSelector(this.record);
        this.groupBys.push(new GroupBy_1.GroupBy(column));
        return this;
    }
    orderBy(columnSelector, direction) {
        const column = columnSelector(this.record);
        this.orderBys.push(new OrderBy_1.OrderBy(column, direction));
        return this;
    }
    limit(limit) {
        this.limitTo = limit;
        return this;
    }
    select(resultSetFactory) {
        const resultSetSchema = resultSetFactory(this.record);
        const selectedColumns = Object.entries(resultSetSchema).map(([alias, column]) => new Projection_1.Projection(column, alias));
        return new ExecutableSelectQuery(selectedColumns, this.source, this.joins, this.wheres, this.havings, this.groupBys, this.orderBys, this.isDistinct, this.limitTo);
    }
    updateRecord(table, alias) {
        this.record[alias] =
            Object.keys(table.columns)
                .reduce((prev, column) => ({ ...prev, [column]: new Column_1.AliasedColumn(alias, column) }), {});
    }
}
class ExecutableSelectQuery {
    constructor(projections, source, joins, wheres, havings, groupBys, orderBys, isDistinct, limitTo) {
        this.projections = projections;
        this.source = source;
        this.joins = joins;
        this.wheres = wheres;
        this.havings = havings;
        this.groupBys = groupBys;
        this.orderBys = orderBys;
        this.isDistinct = isDistinct;
        this.limitTo = limitTo;
    }
    async execute(databaseProvider) {
        const sql = this.toSQL();
        return databaseProvider.get(sql);
    }
    toSQL() {
        const sqlParts = [
            this.selectToSQL(),
            this.sourceToSQL(),
            this.joinsToSQL(),
            this.wheresToSQL(),
            this.groupBysToSQL(),
            this.havingsToSQL(),
            this.orderBysToSQL(),
            this.limitToSQL(),
        ];
        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
    }
    // region string methods
    selectToSQL() {
        return `SELECT ${this.distinctToSQL()}${this.selectedColumnsToSQL()}`;
    }
    sourceToSQL() {
        return `FROM ${this.source}`;
    }
    joinsToSQL() {
        return this.joins.join("\n  ");
    }
    distinctToSQL() {
        return this.isDistinct ? "DISTINCT " : "";
    }
    selectedColumnsToSQL() {
        return this.projections.join(", ");
    }
    wheresToSQL() {
        return this.wheres.length ? `WHERE ${this.wheres.join(" AND ")}` : "";
    }
    havingsToSQL() {
        return this.havings.length ? `HAVING ${this.havings.join(" AND ")}` : "";
    }
    groupBysToSQL() {
        return this.groupBys.length ? `GROUP BY ${this.groupBys.join(", ")}` : "";
    }
    orderBysToSQL() {
        return this.orderBys.length ? `ORDER BY ${this.orderBys.join(", ")}` : "";
    }
    limitToSQL() {
        return this.limitTo ? `LIMIT ${this.limitTo}` : "";
    }
}
