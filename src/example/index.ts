import { BLOG, PERSON, POST } from "./tables";
import { from } from "../queries/select";
import { insertInto } from "../queries/insert";
import { createTable, ForeignKey } from "../queries/create";
import { SQLiteProvider } from "../providers/SQLiteProvider";
import { open } from "sqlite"
import { update } from "../queries/update";

(async () =>
{
	let db = await open("testDatabase/db.db");
	// let db = await open(":memory:");
	let databaseProvider = new SQLiteProvider(db);
	
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
		
	const result = await from(BLOG, "blog", PERSON, "author")
		.joinOn(tables => tables.blog.authorId, tables => tables.author.id)
		.select([ "id", "name" ], [ "firstname", "lastname" ])
		.execute(databaseProvider);

	console.log(result);

	// const result2 = await update(BLOG)
	// 	.set({ name: "Updated Blog" })
	// 	.where("id", 1)
	// 	.execute(databaseProvider);

	// console.log(result2);

	db.close();
})();