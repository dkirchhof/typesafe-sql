import { Table } from "../Table";
export interface IBlog {
    id: number;
    name: string;
    authorId: number;
    content: string;
}
export interface IPost {
    id: number;
    blogId: number;
    content: string;
}
export interface IPerson {
    id: number;
    firstname: string;
    lastname: string;
}
export declare const BLOG: Table<IBlog>;
export declare const POST: Table<IPost>;
export declare const PERSON: Table<IPerson>;
