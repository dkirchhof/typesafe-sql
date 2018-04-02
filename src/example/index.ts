import { BLOG, PERSON, POST, DATE_TEST } from "./tables";
import { from } from "../queries/select";
import { SQLiteProvider } from "../providers/SQLiteProvider";
import { open } from "sqlite"
import { wrappedColumn, wrap } from "../index";

(async () =>
{
	// let db = await open("testDatabase/db.db");
	let db = await open(":memory:");
	let databaseProvider = new SQLiteProvider(db);
	
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

	console.log((await PERSON
		.selectAll()
		.where("firstname", "=", "Daniel")
		.groupBy("lastname")
		.orderBy("id")
		.limit(10)
		.toSQL())
		// .getMany(databaseProvider))
	);
	
	console.log((await PERSON
		.select("id", "firstname")
		.wrapColumn("firstname", "UPPER(", ")")
		.where("firstname", "<>", "Daniel")
		.toSQL())
		// .getOne(databaseProvider))
	);

	console.log((await PERSON
		.selectAll()
		.groupBy("id")
		.toSQL())
	);

	console.log((await PERSON
		.selectAll()
		.groupBy(wrap`UPPER(${"firstname"})`)
		.toSQL())
	);

	db.close();
})();



// console.log(
// 	from(PERSON, "person")
// 		.where(t => wrappedColumn`UPPER(${t.person.firstname})`, "DANIEL")
// 		.select(["id", "firstname", "lastname"])
// 		.toSQL()
// );

