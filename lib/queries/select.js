"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutableSelectQueryWithoutProjections = exports.ExecutableSelectQueryWithProjections = exports.ExecutableSelectQuery = exports.from = void 0;
const Column_1 = require("../Column");
const GroupBy_1 = require("../GroupBy");
const Join_1 = require("../Join");
const OrderBy_1 = require("../OrderBy");
const Projection_1 = require("../Projection");
const Source_1 = require("../Source");
function from(table, alias) {
    return new SelectQuery(table, alias || "root");
}
exports.from = from;
class SelectQuery {
    record = {}; // RecordType = { };
    source;
    joins = [];
    wheres = [];
    havings = [];
    groupBys = [];
    orderBys = [];
    isDistinct;
    limitTo;
    constructor(table, alias) {
        this.source = new Source_1.AliasedSource(table, alias);
        this.updateRecord(table, alias);
    }
    join(joinMode, table, alias, predicateFactory) {
        this.updateRecord(table, alias);
        const predicate = predicateFactory ? predicateFactory(this.record) : null;
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
        return new ExecutableSelectQueryWithProjections(selectedColumns, this.source, this.joins, this.wheres, this.havings, this.groupBys, this.orderBys, this.isDistinct, this.limitTo);
    }
    selectAll() {
        return new ExecutableSelectQueryWithoutProjections(this.source, this.joins, this.wheres, this.havings, this.groupBys, this.orderBys, this.isDistinct, this.limitTo);
    }
    updateRecord(table, alias) {
        this.record[alias] =
            Object.entries(table.columns)
                .reduce((prev, [columnName, columnOptions]) => ({ ...prev, [columnName]: new Column_1.AliasedColumn(alias, columnName, columnOptions) }), {});
    }
}
class ExecutableSelectQuery {
    source;
    joins;
    wheres;
    havings;
    groupBys;
    orderBys;
    isDistinct;
    limitTo;
    constructor(source, joins, wheres, havings, groupBys, orderBys, isDistinct, limitTo) {
        this.source = source;
        this.joins = joins;
        this.wheres = wheres;
        this.havings = havings;
        this.groupBys = groupBys;
        this.orderBys = orderBys;
        this.isDistinct = isDistinct;
        this.limitTo = limitTo;
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
exports.ExecutableSelectQuery = ExecutableSelectQuery;
class ExecutableSelectQueryWithProjections extends ExecutableSelectQuery {
    projections;
    constructor(projections, source, joins, wheres, havings, groupBys, orderBys, isDistinct, limitTo) {
        super(source, joins, wheres, havings, groupBys, orderBys, isDistinct, limitTo);
        this.projections = projections;
    }
    async execute(databaseProvider) {
        const sql = this.toSQL();
        const rawTuples = await databaseProvider.get(sql);
        return rawTuples.map(tuple => Object.entries(tuple).reduce((jsTuple, [alias, value]) => {
            const { converter } = this.getColumnOptionsByAlias(alias);
            return {
                ...jsTuple,
                [alias]: converter ? converter.toJS(value) : value,
            };
        }, {}));
    }
    getColumnOptionsByAlias(alias) {
        return this.projections.find(p => p.alias === alias).column.options;
    }
    selectedColumnsToSQL() {
        return this.projections.join(", ");
    }
}
exports.ExecutableSelectQueryWithProjections = ExecutableSelectQueryWithProjections;
class ExecutableSelectQueryWithoutProjections extends ExecutableSelectQuery {
    async execute(databaseProvider) {
        const sql = this.toSQL();
        const rawTuples = await databaseProvider.get(sql);
        const allColumnOptions = this.getAllColumnOptions();
        return rawTuples.map(tuple => Object.entries(tuple).reduce((jsTuple, [columnName, value]) => {
            const { converter } = allColumnOptions[columnName];
            return {
                ...jsTuple,
                [columnName]: converter ? converter.toJS(value) : value,
            };
        }, {}));
    }
    getAllSources() {
        return [this.source].concat(this.joins.map(join => join.source));
    }
    getAllColumnOptions() {
        return this.getAllSources()
            .reduce((columns, source) => ({ ...columns, ...source.table.columns }), {});
    }
    selectedColumnsToSQL() {
        return "*";
    }
}
exports.ExecutableSelectQueryWithoutProjections = ExecutableSelectQueryWithoutProjections;
