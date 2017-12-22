import { BLOG, PERSON, POST } from "./tables";
import { select } from "../queries/select";
import { insertInto } from "../queries/insert";
import { createTable, ForeignKey } from "../queries/create";
import { SQLiteProvider } from "../providers/SQLiteProvider";
import { open } from "sqlite"
import { AliasedTable } from "../Table";

(async () =>
{
	// let db = await open("testDatabase/db.db");
	let db = await open(":memory:");
	let databaseProvider = new SQLiteProvider(db);
	
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

	
	await createTable(PERSON)
		.columns(
		{ 
			id: { dataType: "INT", primary: true }, 
			firstname: { dataType: "TEXT", notNull: true }, 
			lastname: { dataType: "TEXT", notNull: true }
		})
		.execute(databaseProvider);

	await createTable(BLOG)
		.columns(
		{
			id: { dataType: "INT", primary: true },
			authorId: { dataType: "INT", foreign: new ForeignKey(PERSON, "id") },
			name: { dataType: "TEXT", notNull: true, unique: true },
			content: { dataType: "TEXT", notNull: true }
		})
		.execute(databaseProvider);

	await insertInto(PERSON)
		.values({ id: 1, firstname: "Max", lastname: "Mustermann" })
		.execute(databaseProvider);

	await insertInto(BLOG)
		.values({ id: 1, authorId: 1, name: "Testblog", content: "Das ist ein Testblog" })
		.execute(databaseProvider);

	await insertInto(BLOG)
		.values({ id: 2, authorId: 1, name: "Testblog 2", content: "Das ist ein weiterer Testblog" })
		.execute(databaseProvider);
		
	const ALIASED_BLOG = new AliasedTable(BLOG, "blog");
	const ALIASED_PERSON = new AliasedTable(PERSON, "author");

	const result = await select(ALIASED_BLOG, [ "id", "name" ], ALIASED_PERSON, [ "firstname", "lastname" ])
		.joinOn(ALIASED_BLOG, "authorId", ALIASED_PERSON, "id")
		.execute(databaseProvider);

	console.log(result);

	db.close();
})();