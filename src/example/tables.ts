import { Table } from "../Table";

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