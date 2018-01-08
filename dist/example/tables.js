"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../Table");
exports.BLOG = new Table_1.Table("blogs", {
    id: { dataType: "INT" },
    name: { dataType: "TEXT" },
    content: { dataType: "TEXT" },
    authorId: { dataType: "INT" }
});
exports.POST = new Table_1.Table("posts", {
    id: { dataType: "INT" },
    blogId: { dataType: "INT" },
    content: { dataType: "TEXT" }
});
exports.PERSON = new Table_1.Table("persons", {
    id: { dataType: "INT", primary: true },
    firstname: { dataType: "TEXT" },
    lastname: { dataType: "TEXT" }
});
//# sourceMappingURL=tables.js.map