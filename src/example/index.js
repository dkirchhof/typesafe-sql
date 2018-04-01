"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tables_1 = require("./tables");
const select_1 = require("../queries/select");
const SQLiteProvider_1 = require("../providers/SQLiteProvider");
const sqlite_1 = require("sqlite");
(async () => {
    // let db = await open("testDatabase/db.db");
    let db = await sqlite_1.open(":memory:");
    let databaseProvider = new SQLiteProvider_1.SQLiteProvider(db);
    // enable foreign keys
    await db.get("PRAGMA foreign_keys = ON");
    // await PERSON.create().execute(databaseProvider);
    // await PERSON.insert({ id: 1, firstname: "Max", lastname: "Mustermann" }).execute(databaseProvider);
    // await PERSON.insert({ id: 2, firstname: "Erika", lastname: "Mustermann" }).execute(databaseProvider);
    // // console.log(await from(PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));
    // await PERSON.update({ lastname: "Musterfrau" }).where("firstname", "Erika").execute(databaseProvider);
    // console.log(await from(PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));
    // await PERSON.delete().where("id", 2).execute(databaseProvider);
    // console.log(await from(PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));
    // console.log(await from(PERSON, "person", PERSON, "person2").where(t => t.person.id, t=> t.person2.id).select([], []).execute(databaseProvider));
    // await PERSON.drop().execute(databaseProvider);
    await tables_1.DATE_TEST.create().execute(databaseProvider);
    const date = new Date();
    await tables_1.DATE_TEST.insert({ date }).execute(databaseProvider);
    console.log(await select_1.from(tables_1.DATE_TEST, "dt")
        .where(t => t.dt.date, new Date(), ">=")
        .select()
        .execute(databaseProvider));
    console.log(await select_1.from(tables_1.DATE_TEST, "dt")
        .where(t => t.dt.date, new Date(), "<=")
        .select()
        .execute(databaseProvider));
    await tables_1.DATE_TEST.delete().where("date", new Date()).execute(databaseProvider);
    console.log(await select_1.from(tables_1.DATE_TEST, "dt")
        .select()
        .execute(databaseProvider));
    await tables_1.DATE_TEST.delete().where("date", date).execute(databaseProvider);
    console.log(await select_1.from(tables_1.DATE_TEST, "dt")
        .select()
        .execute(databaseProvider));
    db.close();
})();
// console.log(
// 	from(PERSON, "person")
// 		.where(t => wrappedColumn`UPPER(${t.person.firstname})`, "DANIEL")
// 		.select(["id", "firstname", "lastname"])
// 		.toSQL()
// );
