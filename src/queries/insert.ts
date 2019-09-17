import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Source } from "../Source";
import { Table } from "../Table";
import { sanitizeValue } from "../utils";

export function insertInto<Type>(table: Table<Type>) {
    return new InsertQuery<Type>(table);
}

class InsertQuery<Type> {
    private source: Source;

    constructor(table: Table<Type>) {
        this.source = new Source(table);
    }
    
    public values(tuples: Type | Type[]) {
        if (Array.isArray(tuples)) {
            return new ExecutableInsertQuery(this.source, tuples);
        } else {
            return new ExecutableInsertQuery(this.source, [tuples]);
        }
    }
}

class ExecutableInsertQuery {
    constructor(private source: Source, private tuples: any[]) { }

    public async execute(databaseProvider: IDatabaseProvider) {
        const { lastID } = await databaseProvider.execute(this.toSQL());
        return lastID;
    }

    public toSQL() {
        const columns = Object.keys(this.tuples[0]).join(", ");

        const tuples = this.tuples.map(tuple => {
            const values = Object.entries(tuple).map(([columnName, value]) => {
                const { converter } = this.source.table.columns[columnName];
                
                const convertedValue = converter ? converter.toDB(value) : value;
                const sanitizedValue = sanitizeValue(convertedValue);

                return sanitizedValue;

            }).join(", ");

            return `(${values})`;

        }).join(", ");

        return `INSERT INTO ${this.source}(${columns})\n  VALUES${tuples}`;
    }
}
