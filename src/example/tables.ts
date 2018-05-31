import { IConverter, Table } from "../Table";

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

export const BLOG = new Table<IBlog>("blogs", {
    authorId: { dataType: "INTEGER" },
    content: { dataType: "TEXT" },
    id: { dataType: "INTEGER" },
    name: { dataType: "TEXT" },
});

export const POST = new Table<IPost>("posts", {
    blogId: { dataType: "INTEGER" },
    content: { dataType: "TEXT" },
    id: { dataType: "INTEGER" },
});

export const PERSON = new Table<IPerson>("persons", {
    firstname: { dataType: "TEXT" },
    id: { dataType: "INTEGER", primary: true },
    lastname: { dataType: "TEXT" },
});

interface IDateTest {
    date: Date;
}

const dateConverter: IConverter<Date> = {
    toDB: (input) => input.toISOString(),
    toJS: (input) => new Date(input),
};

export const DATE_TEST = new Table<IDateTest>("dateTests", {
    date: { dataType: "TEXT", converter: dateConverter },
});
