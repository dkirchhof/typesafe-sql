"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Source_1 = require("../Source");
const utils_1 = require("../utils");
function insertInto(table) {
    return new InsertQuery(table);
}
exports.insertInto = insertInto;
class InsertQuery {
    constructor(table) {
        this.source = new Source_1.Source(table);
    }
    values(tuples) {
        if (Array.isArray(tuples)) {
            return new ExecutableInsertQuery(this.source, tuples);
        }
        else {
            return new ExecutableInsertQuery(this.source, [tuples]);
        }
    }
}
class ExecutableInsertQuery {
    constructor(source, tuples) {
        this.source = source;
        this.tuples = tuples;
    }
    async execute(databaseProvider) {
        const { lastID } = await databaseProvider.execute(this.toSQL());
        return lastID;
    }
    toSQL() {
        const columns = Object.keys(this.tuples[0]).join(", ");
        const tuples = this.tuples.map(tuple => {
            const values = Object.entries(tuple).map(([columnName, value]) => {
                const { converter } = this.source.table.columns[columnName];
                const convertedValue = converter ? converter.toDB(value) : value;
                const sanitizedValue = utils_1.sanitizeValue(convertedValue);
                return sanitizedValue;
            }).join(", ");
            return `(${values})`;
        }).join(", ");
        return `INSERT INTO ${this.source}(${columns})\n  VALUES${tuples}`;
    }
}
