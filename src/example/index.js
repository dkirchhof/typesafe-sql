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
    await tables_1.PERSON.create().execute(databaseProvider);
    await tables_1.PERSON.insert({ id: 1, firstname: "Max", lastname: "Mustermann" }).execute(databaseProvider);
    await tables_1.PERSON.insert({ id: 2, firstname: "Erika", lastname: "Mustermann" }).execute(databaseProvider);
    console.log(await select_1.from(tables_1.PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));
    await tables_1.PERSON.update({ lastname: "Musterfrau" }).where("firstname", "Erika").execute(databaseProvider);
    console.log(await select_1.from(tables_1.PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));
    await tables_1.PERSON.delete().where("id", 2).execute(databaseProvider);
    console.log(await select_1.from(tables_1.PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));
    await tables_1.PERSON.drop().execute(databaseProvider);
    db.close();
})();
