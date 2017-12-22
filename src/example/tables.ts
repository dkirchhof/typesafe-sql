import { Table } from "../Table";

interface IBlog
{
	id: number;
	name: string;
	authorId: number;
	content: string;
}

interface IPost
{
	id: number;
	blogId: number;
	content: string;
}

interface IPerson
{
	id: number;
	firstname: string;
	lastname: string;
}

export const BLOG = new Table<IBlog>("blog");
export const POST = new Table<IPost>("post");
export const PERSON = new Table<IPerson>("person");