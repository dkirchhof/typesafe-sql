import { Column } from "../Column";
import { Predicate, PredicateFactory, PredicateGroup } from "../Predicate";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Source } from "../Source";
import { Columns, Table } from "../Table";
import { sanitizeValue } from "../utils";

export function update<Type>(table: Table<Type>) {
    return new UpdateQuery<Type>(table);
}

class UpdateQuery<Type> {
    constructor(private table: Table<Type>) { }

    public set(values: Partial<Type>) {
        return new ExecutableUpdateQuery(this.table, values);
    }
}

class ExecutableUpdateQuery<Type> {
    private source: Source;
    private columns: Columns<Type>;
    private wheres: Array<Predicate<any> | PredicateGroup> = [];

    constructor(table: Table<any>, private values: Partial<Type>) {
        this.source = new Source(table);

        this.columns = Object.entries(table.columns)
            .reduce((prev, [columnName, columnOptions]) => ({ ...prev, [columnName]: new Column(columnName, columnOptions) }), { } as Columns<Type>);
    }

    public where(predicateFactory: PredicateFactory<Columns<Type>>) {
        const predicate = predicateFactory(this.columns);

        this.wheres.push(predicate);

        return this;
    }

    public async execute(databaseProvider: IDatabaseProvider) {
        const { changes } = await databaseProvider.execute(this.toSQL());
        return changes;
    }

    public toSQL() {
        const sqlParts: string[] = [
            this.updateToSQL(),
            this.setValuesToSQL(),
            this.wheresToSQL(),
        ];

        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
    }

    // region string methods

    private updateToSQL() {
        return `UPDATE ${this.source}`;
    }

    private setValuesToSQL() {
        const values = Object.entries(this.values).map(([columnName, value]) => {
            const { converter } = this.source.table.columns[columnName];
                
            const convertedValue = converter ? converter.toDB(value) : value;
            const sanitizedValue = sanitizeValue(convertedValue);

            return `${columnName} = ${sanitizedValue}`;

        }).join(", ");

        return `SET ${values}`;
    }

    private wheresToSQL() {
        return this.wheres.length ? `WHERE ${this.wheres.join(" AND ")}` : "";
    }

    // endregion
}
