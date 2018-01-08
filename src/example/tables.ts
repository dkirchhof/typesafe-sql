import { Table } from "../Table";
import { ForeignKey } from "../index";

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
	id: { dataType: "INT" },
	name: { dataType: "TEXT" },
	content: { dataType: "TEXT" },
	authorId: { dataType: "INT" }
});

export const POST = new Table<IPost>("posts", {
	id: { dataType: "INT" },
	blogId: { dataType: "INT" },
	content: { dataType: "TEXT" }
});

export const PERSON = new Table<IPerson>("persons", {
	id: { dataType: "INT", primary: true },
	firstname: { dataType: "TEXT" },
	lastname: { dataType: "TEXT" }
});