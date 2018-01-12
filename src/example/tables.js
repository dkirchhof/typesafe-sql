"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../Table");
exports.BLOG = new Table_1.Table("blogs", {
    id: { dataType: "INTEGER" },
    name: { dataType: "TEXT" },
    content: { dataType: "TEXT" },
    authorId: { dataType: "INTEGER" }
});
exports.POST = new Table_1.Table("posts", {
    id: { dataType: "INTEGER" },
    blogId: { dataType: "INTEGER" },
    content: { dataType: "TEXT" }
});
exports.PERSON = new Table_1.Table("persons", {
    id: { dataType: "INTEGER", primary: true },
    firstname: { dataType: "TEXT" },
    lastname: { dataType: "TEXT" }
});
