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

export const BLOG = new Table<IBlog>("blog", {
	id: { dataType: "INT" },
	name: { dataType: "TEXT" },
	content: { dataType: "TEXT" },
	authorId: { dataType: "INT" }
});

export const POST = new Table<IPost>("post", {
	id: { dataType: "INT" },
	blogId: { dataType: "INT" },
	content: { dataType: "TEXT" }
});

export const PERSON = new Table<IPerson>("person", {
	id: { dataType: "INT" },
	firstname: { dataType: "TEXT" },
	lastname: { dataType: "TEXT" }
});