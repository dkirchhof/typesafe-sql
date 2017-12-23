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

export const BLOG = new Table<IBlog>("blog");
export const POST = new Table<IPost>("post");
export const PERSON = new Table<IPerson>("person");