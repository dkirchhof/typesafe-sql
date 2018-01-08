"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tables_1 = require("./tables");
const select_1 = require("../queries/select");
const SQLiteProvider_1 = require("../providers/SQLiteProvider");
const sqlite_1 = require("sqlite");
(async () => {
    let db = await sqlite_1.open("testDatabase/db.db");
    // let db = await open(":memory:");
    let databaseProvider = new SQLiteProvider_1.SQLiteProvider(db);
    // enable foreign keys
    await db.get("PRAGMA foreign_keys = ON");
    // await createTable(PERSON)
    // 	.columns(
    // 	{ 
    // 		id: { dataType: "INT", primary: true }, 
    // 		firstname: { dataType: "TEXT", notNull: true }, 
    // 		lastname: { dataType: "TEXT", notNull: true }
    // 	})
    // 	.execute(databaseProvider);
    // await createTable(BLOG)
    // 	.columns(
    // 	{
    // 		id: { dataType: "INT", primary: true },
    // 		authorId: { dataType: "INT", foreign: new ForeignKey(PERSON, "id") },
    // 		name: { dataType: "TEXT", notNull: true, unique: true },
    // 		content: { dataType: "TEXT", notNull: true }
    // 	})
    // 	.execute(databaseProvider);
    // await insertInto(PERSON)
    // 	.values({ id: 1, firstname: "Max", lastname: "Mustermann" })
    // 	.execute(databaseProvider);
    // await insertInto(BLOG)
    // 	.values({ id: 1, authorId: 1, name: "Testblog", content: "Das ist ein Testblog" })
    // 	.execute(databaseProvider);
    // await insertInto(BLOG)
    // 	.values({ id: 2, authorId: 1, name: "Testblog 2", content: "Das ist ein weiterer Testblog" })
    // 	.execute(databaseProvider);
    const result = await select_1.from(tables_1.BLOG, "blog", tables_1.PERSON, "author")
        .joinOn(tables => tables.blog.authorId, tables => tables.author.id)
        .select(["id", "name"], ["firstname", "lastname"])
        .execute(databaseProvider);
    console.log(result);
    // const result2 = await update(BLOG)
    // 	.set({ name: "Updated Blog" })
    // 	.where("id", 1)
    // 	.execute(databaseProvider);
    // console.log(result2);
    // const result3 = await select(ALIASED_BLOG, [ "id", "name" ], ALIASED_PERSON, [ "firstname", "lastname" ])
    // 	.joinOn(ALIASED_BLOG, "authorId", ALIASED_PERSON, "id")
    // 	.execute(databaseProvider);
    // console.log(result3);
    db.close();
})();
//# sourceMappingURL=index.js.map