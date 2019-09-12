import { open } from "sqlite";

import { max, avg } from "../Aggregation";
import { equals, Predicate } from "../Predicate";
import { SQLiteProvider } from "../providers/SQLiteProvider";
import { PERSON } from "./tables";

(async () => {
    // const db = await open("testDatabase/db.db");
    const db = await open(":memory:");
    const databaseProvider = new SQLiteProvider(db);

    // enable foreign keys
    await db.get("PRAGMA foreign_keys = ON");
    
    // console.log(PERSON.create().toSQL());
    // console.log(PERSON.insert({ id: 1, firstname: "Max", lastname: "Mustermann", parentId: null }).toSQL());

    await PERSON.create().execute(databaseProvider);
    
    await PERSON.insert({ id: 1, firstname: "Max", lastname: "Mustermann", parentId: null }).execute(databaseProvider);
    await PERSON.insert({ id: 2, firstname: "Erika", lastname: "Mustermann", parentId: null }).execute(databaseProvider);
    await PERSON.insert({ id: 3, firstname: "Baby", lastname: "Mustermann", parentId: 1 }).execute(databaseProvider);

    const query = PERSON.query("user")
        .where(r => new Predicate(r.user.parentId, "IS NOT", null))
        // .where(r => new Predicate(r.user.firstname, "IS NOT", null))
        .join("LEFT OUTER", PERSON, "parent", r => equals(r.user.parentId, r.parent.id))
        // .where(r => equals(r.user.firstname, "Erika"))
        // .orderBy(r => r.user.lastname, "ASC")
        // .groupBy(r => r.user.id)
        // .select(r => ({ maxId: max(r.user.id), avgId: avg(r.user.id) }));
        // .select(r => ({ ...r.user }))
        .select(r => ({ ...r.user, parentFirstname: r.parent.firstname }));
        
    const result = await query.getMany(databaseProvider);
        
    console.log(query.toSQL());
    console.log(result);

    // await PERSON.update({ lastname: "Musterfrau" }).where("firstname", "Erika").execute(databaseProvider);
    await PERSON.delete().where("id", "=", 2).execute(databaseProvider);
    // await PERSON.drop().execute(databaseProvider);

    db.close();
})();

// const joinedQuery = PERSON
//     .query()
//     .join("LEFT OUTER", PERSON, "mother", r => r.root.id, "=", r => r.mother.id)
//     .where(r => r.mother.firstname, "=", "daniel")
//     .groupBy(r => r.mother.lastname)
//     .orderBy(r => r.root.firstname)
//     .select(r => ({ name: r.root.firstname, min: MIN(r.root.id), max: MAX(r.root.id) }));

// console.log(joinedQuery.toSQL());
// console.log(query.getOne());
