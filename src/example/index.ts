import { BLOG, PERSON, POST } from "./tables";
import { select } from "../queries/select";
import { insertInto } from "../queries/insert";
import { createTable, ForeignKey } from "../queries/create";
import { SQLiteProvider } from "../providers/SQLiteProvider";



// const insertQuery = insertInto(BLOG)
// 	.values({ id: 1, authorId: 1, content: "hallo", name: "test blog" });

// console.log(insertQuery.toSQL());

import { open } from "sqlite"
import { AliasedTable } from "../Table";

(async () =>
{
	// let db = await open("testDatabase/db.db");
	let db = await open(":memory:");
	let databaseProvider = new SQLiteProvider(db);

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

	const ALIASED_PERSON = new AliasedTable(PERSON, "person");
	// const ALIASED_PERSON2 = new AliasedTable(PERSON, "person2");
	// const ALIASED_BLOG = new AliasedTable(BLOG, "blog");

	// const result3 = await select(ALIASED_PERSON, [ "id", "firstname", "lastname" ], ALIASED_BLOG, [ "name" ])
	// 	.execute(databaseProvider);
	
	// console.log(result3[0].blog);


	// const result4 = await select(ALIASED_PERSON, [ "firstname" ], ALIASED_PERSON2, [ "firstname" ])
	// 	.execute(databaseProvider);

	// console.log(result4[0]);


	await createTable(PERSON)
		.columns(
		{ 
			id: { dataType: "INT", primary: true }, 
			firstname: { dataType: "TEXT", notNull: true }, 
			lastname: { dataType: "TEXT", notNull: true }
		})
		.execute(databaseProvider);

	const result = await select(ALIASED_PERSON, [ "id", "firstname", "lastname" ]).execute(databaseProvider);
	console.log(result);

	await insertInto(PERSON)
		.values({ id: 1, firstname: "Max", lastname: "Mustermann" })
		.execute(databaseProvider);

	const result2 = await select(ALIASED_PERSON, [ "id", "firstname", "lastname" ]).execute(databaseProvider);
	console.log(result2);

	

	db.close();

	// lastID: 2,
	// changes: 1 
})();