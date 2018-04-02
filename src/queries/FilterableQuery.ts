import { Table, sanitizeValue, convertValue } from "..";
import { Filter, ExtendedFilter } from "../Filter";
import { BaseQuery } from "./BaseQuery";
import { Operator } from "../Operator";

export abstract class FilterableQuery<Type> extends BaseQuery<Type>
{
    protected filters: Required<Filter<Type, keyof Type>>[] = [];
    
    where<Column extends keyof Type>(column: Column, operator: Operator, value: Type[Column])
	{
        this.filters.push({ column, operator, value });
		return this;
    }

    protected filtersToSQL()
    {
        const map = (filter: Required<Filter<Type, keyof Type>>) =>
        {
            const columnOptions = this.table.columns[filter.column];
            const value = sanitizeValue(convertValue(columnOptions, filter.value));

            return `${filter.column} ${filter.operator} ${value}`;
        }

        return this.filters.length ? `WHERE ${this.filters.map(map).join(" AND ")}` : "";
    }
}