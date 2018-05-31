"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../Table");
exports.BLOG = new Table_1.Table("blogs", {
    authorId: { dataType: "INTEGER" },
    content: { dataType: "TEXT" },
    id: { dataType: "INTEGER" },
    name: { dataType: "TEXT" },
});
exports.POST = new Table_1.Table("posts", {
    blogId: { dataType: "INTEGER" },
    content: { dataType: "TEXT" },
    id: { dataType: "INTEGER" },
});
exports.PERSON = new Table_1.Table("persons", {
    firstname: { dataType: "TEXT" },
    id: { dataType: "INTEGER", primary: true },
    lastname: { dataType: "TEXT" },
});
const dateConverter = {
    toDB: (input) => input.toISOString(),
    toJS: (input) => new Date(input),
};
exports.DATE_TEST = new Table_1.Table("dateTests", {
    date: { dataType: "TEXT", converter: dateConverter },
});
