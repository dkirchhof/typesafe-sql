"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tables_1 = require("./tables");
const select_1 = require("../queries/select");
const insert_1 = require("../queries/insert");
const create_1 = require("../queries/create");
const SQLiteProvider_1 = require("../providers/SQLiteProvider");
const sqlite_1 = require("sqlite");
const Table_1 = require("../Table");
const update_1 = require("../queries/update");
(async () => {
    // let db = await open("testDatabase/db.db");
    let db = await sqlite_1.open(":memory:");
    let databaseProvider = new SQLiteProvider_1.SQLiteProvider(db);
    // enable foreign keys
    await db.get("PRAGMA foreign_keys = ON");
    // const result = await db.run(`INSERT INTO person VALUES(2, "fdsf", "gergerg"), (3, "fdsf", "grgger")`);
    // console.log(result, result.lastID);
    // const result = await select(BLOG, ["id"], PERSON, ["firstname", "lastname"])
    // 	.joinOn(BLOG, "authorId", PERSON, "id")
    // 	.where(BLOG, "id", 1).execute(databaseProvider);
    // console.log(result);
    // const result2 = await insertInto(databaseProvider, PERSON)
    // 	.values({ id: 10, firstname: "fdfsd", lastname: "fsdf" })
    // 	.execute();
    // console.log(result2);
    // const result3 = await select(ALIASED_PERSON, [ "id", "firstname", "lastname" ], ALIASED_BLOG, [ "name" ])
    // 	.execute(databaseProvider);
    // console.log(result3[0].blog);
    await create_1.createTable(tables_1.PERSON)
        .columns({
        id: { dataType: "INT", primary: true },
        firstname: { dataType: "TEXT", notNull: true },
        lastname: { dataType: "TEXT", notNull: true }
    })
        .execute(databaseProvider);
    await create_1.createTable(tables_1.BLOG)
        .columns({
        id: { dataType: "INT", primary: true },
        authorId: { dataType: "INT", foreign: new create_1.ForeignKey(tables_1.PERSON, "id") },
        name: { dataType: "TEXT", notNull: true, unique: true },
        content: { dataType: "TEXT", notNull: true }
    })
        .execute(databaseProvider);
    await insert_1.insertInto(tables_1.PERSON)
        .values({ id: 1, firstname: "Max", lastname: "Mustermann" })
        .execute(databaseProvider);
    await insert_1.insertInto(tables_1.BLOG)
        .values({ id: 1, authorId: 1, name: "Testblog", content: "Das ist ein Testblog" })
        .execute(databaseProvider);
    await insert_1.insertInto(tables_1.BLOG)
        .values({ id: 2, authorId: 1, name: "Testblog 2", content: "Das ist ein weiterer Testblog" })
        .execute(databaseProvider);
    const ALIASED_BLOG = new Table_1.AliasedTable(tables_1.BLOG, "blog");
    const ALIASED_PERSON = new Table_1.AliasedTable(tables_1.PERSON, "author");
    const result = await select_1.select(ALIASED_BLOG, ["id", "name"], ALIASED_PERSON, ["firstname", "lastname"])
        .joinOn(ALIASED_BLOG, "authorId", ALIASED_PERSON, "id")
        .execute(databaseProvider);
    console.log(result);
    const result2 = await update_1.update(tables_1.BLOG)
        .set({ name: "Updated Blog" })
        .where("id", 1)
        .execute(databaseProvider);
    console.log(result2);
    const result3 = await select_1.select(ALIASED_BLOG, ["id", "name"], ALIASED_PERSON, ["firstname", "lastname"])
        .joinOn(ALIASED_BLOG, "authorId", ALIASED_PERSON, "id")
        .execute(databaseProvider);
    console.log(result3);
    db.close();
})();
//# sourceMappingURL=index.js.map