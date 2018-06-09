import { open } from "sqlite";
import { SQLiteProvider } from "../providers/SQLiteProvider";
import { CF, MAX, MIN } from "../SQLFunctions";
import { BLOG, DATE_TEST, PERSON, POST } from "./tables";

(async () => {
    // const db = await open("testDatabase/db.db");
    const db = await open(":memory:");
    const databaseProvider = new SQLiteProvider(db);

    // enable foreign keys
    await db.get("PRAGMA foreign_keys = ON");

    await PERSON.create().execute(databaseProvider);

    await PERSON.insert({ id: 1, firstname: "Max", lastname: "Mustermann" }).execute(databaseProvider);
    await PERSON.insert({ id: 2, firstname: "Erika", lastname: "Mustermann" }).execute(databaseProvider);
    // // console.log(await from(PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));

    // await PERSON.update({ lastname: "Musterfrau" }).where("firstname", "Erika").execute(databaseProvider);
    // console.log(await from(PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));

    // await PERSON.delete().where("id", 2).execute(databaseProvider);
    // console.log(await from(PERSON, "person").select(["id", "firstname", "lastname"]).execute(databaseProvider));

    // console.log(await from(PERSON, "person", PERSON, "person2").where(t => t.person.id, t=> t.person2.id).select([], []).execute(databaseProvider));

    // await PERSON.drop().execute(databaseProvider);

    // await DATE_TEST.create().execute(databaseProvider);

    // const date = new Date();
    // await DATE_TEST.insert({ date }).execute(databaseProvider);

    // console.log(await from(DATE_TEST, "dt")
    // 	.where(t => t.dt.date, new Date(), ">=")
    // 	.select()
    // 	.execute(databaseProvider)
    // );

    // console.log(await from(DATE_TEST, "dt")
    // 	.where(t => t.dt.date, new Date(), "<=")
    // 	.select()
    // 	.execute(databaseProvider)
    // );

    // await DATE_TEST.delete().where("date", new Date()).execute(databaseProvider);

    // console.log(await from(DATE_TEST, "dt")
    // 	.select()
    // 	.execute(databaseProvider)
    // );

    // await DATE_TEST.delete().where("date", date).execute(databaseProvider);

    // console.log(await from(DATE_TEST, "dt")
    // 	.select()
    // 	.execute(databaseProvider)
    // );

    console.log(PERSON
        .query()
        .where(r => r.root.firstname, "=", "Daniel")
        .groupBy(r => r.root.lastname)
        .orderBy(r => r.root.id)
        .limit(10)
        .selectAll()
        .toSQL());

    console.log(PERSON
        .query()
        .where(r => r.root.firstname, "<>", "Daniel")
        .select(r => ({ id: r.root.id, FIRSTNAME: CF`UPPER(${r.root.firstname})` }))
        .toSQL());

    console.log(PERSON
        .query()
        .groupBy(r => r.root.id)
        .selectAll()
        .toSQL());

    console.log(PERSON
        .query()
        .groupBy(r => CF`UPPER(${r.root.lastname})`)
        .selectAll()
        .toSQL());

    console.log(PERSON
        .insert({ id: 1, firstname: "Daniel", lastname: "Kirchhof" })
        .toSQL());

    console.log(PERSON
        .insert([
            { id: 2, firstname: "AAAA", lastname: "aaaa" },
            { id: 3, firstname: "BBBB", lastname: "bbbb" },
        ])
        .toSQL());

    console.log(PERSON
        .update({ firstname: "CCCC" })
        .where("firstname", "=", "AAAA")
        .toSQL());

    console.log(PERSON
        .delete()
        .where("firstname", "=", "CCCC")
        .toSQL());

    db.close();
})();

const joinedQuery = PERSON
    .query()
    .join("LEFT OUTER", PERSON, "mother", r => r.root.id, "=", r => r.mother.id)
    .where(r => r.mother.firstname, "=", "daniel")
    .groupBy(r => r.mother.lastname)
    .orderBy(r => r.root.firstname)
    .select(r => ({ name: r.root.firstname, min: MIN(r.root.id), max: MAX(r.root.id) }));

console.log(joinedQuery.toSQL());
// console.log(query.getOne());
