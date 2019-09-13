import { open } from "sqlite";

import { avg, max } from "../Aggregation";
import { equals, Predicate } from "../Predicate";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { SQLiteProvider } from "../providers/SQLiteProvider";
import { createTable } from "../queries/create";
import { deleteFrom } from "../queries/delete";
import { dropTable } from "../queries/drop";
import { insertInto } from "../queries/insert";
import { update } from "../queries/update";
import { PERSON } from "./tables";
import { from } from "../queries/select";

(async () => {
    // const db = await open("testDatabase/db.db");
    const db = await open(":memory:");
    const databaseProvider = new SQLiteProvider(db);

    // enable foreign keys
    await db.get("PRAGMA foreign_keys = ON");

    await createExample(databaseProvider);
    await insertExample(databaseProvider);
    await selectExample(databaseProvider);
    await updateExample(databaseProvider);
    await deleteExample(databaseProvider);
    await dropExample(databaseProvider);

    db.close();
})();

async function createExample(databaseProvider: IDatabaseProvider) {
    const query = createTable(PERSON);
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function insertExample(databaseProvider: IDatabaseProvider) {
    const query = insertInto(PERSON)
        .values([
            { id: 1, firstname: "Max", lastname: "Mustermann", parentId: null },
            { id: 2, firstname: "Erika", lastname: "Mustermann", parentId: null },
            { id: 3, firstname: "Baby", lastname: "Mustermann", parentId: 1 }
        ]);

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function selectExample(databaseProvider: IDatabaseProvider) {
    const query = from(PERSON, "user")
        .where(r => new Predicate(r.user.parentId, "IS NOT", null))
        // .where(r => new Predicate(r.user.firstname, "IS NOT", null))
        .join("LEFT OUTER", PERSON, "parent", r => equals(r.user.parentId, r.parent.id))
        // .where(r => equals(r.user.firstname, "Erika"))
        // .orderBy(r => r.user.lastname, "ASC")
        // .groupBy(r => r.user.id)
        // .return(r => ({ maxId: max(r.user.id), avgId: avg(r.user.id) }));
        // .return(r => ({ ...r.user }))
        .select(r => ({ ...r.user, parentFirstname: r.parent.firstname }));
        
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function updateExample(databaseProvider: IDatabaseProvider) {
    const query = update(PERSON)
        .set({ lastname: "Musterfrau" })
        .where(r => equals(r.firstname, "Erika"));

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function deleteExample(databaseProvider: IDatabaseProvider) {
    const query = deleteFrom(PERSON)
        .where(r => equals(r.id, 1));

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function dropExample(databaseProvider: IDatabaseProvider) {
    const query = dropTable(PERSON);
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}
