import { BLOG, PERSON, POST } from "./tables";
import { select } from "../queries/select";

const query = select(BLOG, ["id"], PERSON, ["firstname", "lastname"])
	.joinOn(BLOG, "authorId", PERSON, "id")
	.where(BLOG, "id", 1);//.getOne().person.firstname;

console.log(query.toSQL());