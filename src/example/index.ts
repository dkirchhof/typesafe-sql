import { BLOG, PERSON, POST } from "./tables";
import { select } from "../queries/select";
import { insertInto } from "../queries/insert";
import { SQLiteProvider } from "../providers/SQLiteProvider";



// const insertQuery = insertInto(BLOG)
// 	.values({ id: 1, authorId: 1, content: "hallo", name: "test blog" });

// console.log(insertQuery.toSQL());

import { open } from "sqlite"

(async () =>
{
	let db = await open("testDatabase/db.db");
	let databaseProvider = new SQLiteProvider(db);

	// const result = await db.run(`INSERT INTO person VALUES(2, "fdsf", "gergerg"), (3, "fdsf", "grgger")`);
	// console.log(result, result.lastID);

	// const result = await select(databaseProvider, BLOG, ["id"], PERSON, ["firstname", "lastname"])
	// 	.joinOn(BLOG, "authorId", PERSON, "id")
	// 	.where(BLOG, "id", 1).getMany();

	// console.log(result);

	// const result2 = await insertInto(databaseProvider, PERSON)
	// 	.values({ id: 10, firstname: "fdfsd", lastname: "fsdf" })
	// 	.execute();

	// console.log(result2);

	const result3 = await select(databaseProvider, PERSON, [ "id", "firstname", "lastname" ]).limit(1).execute();
	console.log(result3);

	db.close();

	// lastID: 2,
	// changes: 1 
})();