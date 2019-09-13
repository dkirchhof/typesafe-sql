import { Column } from "../Column";
import { Predicate } from "../Predicate";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Source } from "../Source";
import { Columns, Table } from "../Table";

export function deleteFrom(table: Table<any>) {
    return new DeleteQuery(table);
}

class DeleteQuery<Type> {
    private source: Source;
    private columns: Columns<Type>;
    private wheres: Array<Predicate<any>> = [];

    constructor(table: Table<Type>) { 
        this.source = new Source(table);

        this.columns = Object.keys(table.columns)
            .reduce((prev, columnName) => ({ ...prev, [columnName]: new Column(columnName) }), { } as Columns<Type>);
    }

    public where(predicateFactory: (columns: Columns<Type>) => Predicate<any>) {
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
            this.deleteToSQL(),
            this.wheresToSQL(),
        ];

        // strip out null, undefined and empty strings
        // and concat strings with linebreak and some spaces
        return sqlParts
            .filter(Boolean)
            .join("\n  ");
    }

    // region string methods

    private deleteToSQL() {
        return `DELETE FROM ${this.source}`;
    }

    private wheresToSQL() {
        return this.wheres.length ? `WHERE ${this.wheres.join(" AND ")}` : "";
    }

    // endregion
}
