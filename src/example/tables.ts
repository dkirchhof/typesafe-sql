import { Table, IConverter } from "../Table";

export interface IBlog
{
	id: number;
	name: string;
	authorId: number;
	content: string;
}

export interface IPost
{
	id: number;
	blogId: number;
	content: string;
}

export interface IPerson
{
	id: number;
	firstname: string;
	lastname: string;
}

export const BLOG = new Table<IBlog>("blogs", {
	id: { dataType: "INTEGER" },
	name: { dataType: "TEXT" },
	content: { dataType: "TEXT" },
	authorId: { dataType: "INTEGER" }
});

export const POST = new Table<IPost>("posts", {
	id: { dataType: "INTEGER" },
	blogId: { dataType: "INTEGER" },
	content: { dataType: "TEXT" }
});

export const PERSON = new Table<IPerson>("persons", {
	id: { dataType: "INTEGER", primary: true },
	firstname: { dataType: "TEXT" },
	lastname: { dataType: "TEXT" }
});


interface DateTest
{
	date: Date;
}

const dateConverter: IConverter<Date> = {
	toDB: (input) => input.toISOString(),
	toJS: (input) => new Date(input)
}

export const DATE_TEST = new Table<DateTest>("dateTests", {
	date: { dataType: "TEXT", converter: dateConverter }
});