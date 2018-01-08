"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../Table");
exports.BLOG = new Table_1.Table("blog", {
    id: { dataType: "INT" },
    name: { dataType: "TEXT" },
    content: { dataType: "TEXT" },
    authorId: { dataType: "INT" }
});
exports.POST = new Table_1.Table("post", {
    id: { dataType: "INT" },
    blogId: { dataType: "INT" },
    content: { dataType: "TEXT" }
});
exports.PERSON = new Table_1.Table("person", {
    id: { dataType: "INT" },
    firstname: { dataType: "TEXT" },
    lastname: { dataType: "TEXT" }
});
//# sourceMappingURL=tables.js.map