import { convertValue, sanitizeValue, Table } from "..";
import { IFilter } from "../Filter";
import { Operator } from "../Operator";
import { BaseQuery } from "./BaseQuery";

export abstract class FilterableQuery<Type> extends BaseQuery<Type> {
    protected filters: Array<IFilter<Type, keyof Type>> = [];

    public where<Column extends keyof Type>(column: Column, operator: Operator, value: Type[Column] | Array<Type[Column]>) {
        this.filters.push({ column, operator, value });
        return this;
    }

    protected filtersToSQL() {
        const map = (filter: IFilter<Type, keyof Type>) => {
            const columnOptions = this.table.columns[filter.column];
            let value;

            if (Array.isArray(filter.value)) {
                const list = filter.value.map(v => sanitizeValue(convertValue(columnOptions, v)));
                value = `(${list.join(", ")})`;
            } else {
                value = sanitizeValue(convertValue(columnOptions, filter.value));
            }

            return `${filter.column} ${filter.operator} ${value}`;
        };

        return this.filters.length ? `WHERE ${this.filters.map(map).join(" AND ")}` : "";
    }
}
