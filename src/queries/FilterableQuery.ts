import { Table, sanitizeValue, convertValue } from "..";
import { Filter } from "../Filter";
import { BaseQuery } from "./BaseQuery";
import { Operator } from "../Operator";

export abstract class FilterableQuery<Type> extends BaseQuery<Type>
{
    protected filters: Filter<Type, keyof Type>[] = [];
    
    where<Column extends keyof Type>(column: Column, operator: Operator, value: Type[Column] | Type[Column][])
	{
        this.filters.push({ column, operator, value });
		return this;
    }

    protected filtersToSQL()
    {
        const map = (filter: Filter<Type, keyof Type>) =>
        {
            const columnOptions = this.table.columns[filter.column];
            let value;

            if(Array.isArray(filter.value))
            {
                const list = filter.value.map(v => sanitizeValue(convertValue(columnOptions, v)));
                value = `(${list.join(", ")})`;
            }
            else
            {
                value = sanitizeValue(convertValue(columnOptions, filter.value));
            }

            return `${filter.column} ${filter.operator} ${value}`;
        }

        return this.filters.length ? `WHERE ${this.filters.map(map).join(" AND ")}` : "";
    }
}