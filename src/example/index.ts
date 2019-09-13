import { open } from "sqlite";

import { avg, max, count } from "../Aggregation";
import { eq, Predicate, gt } from "../Predicate";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { SQLiteProvider } from "../providers/SQLiteProvider";
import { createTable } from "../queries/create";
import { deleteFrom } from "../queries/delete";
import { dropTable } from "../queries/drop";
import { insertInto } from "../queries/insert";
import { from } from "../queries/select";
import { update } from "../queries/update";
import { albums, artists, genres } from "./tables";
import { Table } from "../Table";

(async () => {
    // const db = await open("testDatabase/db.db");
    const db = await open(":memory:");
    const databaseProvider = new SQLiteProvider(db);

    // enable foreign keys
    await db.get("PRAGMA foreign_keys = ON");

    await createExampleTable(artists, databaseProvider);
    await createExampleTable(genres, databaseProvider);
    await createExampleTable(albums, databaseProvider);

    await insertArtists(databaseProvider);
    await insertGenres(databaseProvider);
    await insertAlbums(databaseProvider);

    await selectAlbumsWithArtistAndGenre(databaseProvider);
    await selectGenresWithMoreThan5Albums(databaseProvider);
    // await updateExample(databaseProvider);
    // await deleteExample(databaseProvider);
    // await dropExample(databaseProvider);

    db.close();
})();

async function createExampleTable(table: Table<any>, databaseProvider: IDatabaseProvider) {
    const query = createTable(table);
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function insertArtists(databaseProvider: IDatabaseProvider) {
    const query = insertInto(artists)
        .values([
            { id: 1, name: "Architects" },
            { id: 2, name: "While She Sleeps" },
            { id: 3, name: "Misfits" },
            { id: 4, name: "Iron Maiden" },
        ]);

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function insertGenres(databaseProvider: IDatabaseProvider) {
    const query = insertInto(genres)
        .values([
            { id: 1, name: "Metalcore" },
            { id: 2, name: "Punk" },
            { id: 3, name: "Heavy Metal" },
        ]);

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function insertAlbums(databaseProvider: IDatabaseProvider) {
    const query = insertInto(albums)
        .values([
            { id: 1, name: "Hollow Crown", artistId: 1, genreId: 1 },
            { id: 2, name: "Lost Forever // Lost Together", artistId: 1, genreId: 1 },

            { id: 3, name: "This Is the Six", artistId: 2, genreId: 1 },
            { id: 4, name: "Brainwashed", artistId: 2, genreId: 1 },
            { id: 5, name: "You Are We", artistId: 2, genreId: 1 },
            { id: 6, name: "So What?", artistId: 2, genreId: 1 },

            { id: 7, name: "Static Age", artistId: 3, genreId: 2 },
            { id: 8, name: "Walk Among Us", artistId: 3, genreId: 2 },
            { id: 9, name: "American Psycho", artistId: 3, genreId: 2 },

            { id: 10, name: "Iron Maiden", artistId: 4, genreId: 3 },
            { id: 11, name: "The Number of the Beast", artistId: 4, genreId: 3 },
            { id: 12, name: "Fear of the Dark", artistId: 4, genreId: 3 },
        ]);

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function selectAlbumsWithArtistAndGenre(databaseProvider: IDatabaseProvider) {
    const query = from(albums, "album")
        .join("LEFT OUTER", artists, "artist", r => eq(r.album.artistId, r.artist.id))
        .join("LEFT OUTER", genres, "genre", r => eq(r.album.genreId, r.genre.id))
        .select(r => ({ album: r.album.name, artist: r.artist.name, genre: r.genre.name }));
        
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function selectGenresWithMoreThan5Albums(databaseProvider: IDatabaseProvider) {
    const query = from(albums, "album")
        .join("LEFT OUTER", genres, "genre", r => eq(r.album.genreId, r.genre.id))
        .groupBy(r => r.album.genreId)
        .having(r => gt(count(r.album.id), 5))
        .select(r => ({ genre: r.genre.name, numberOfAlbums: count(r.album.id) }));
        
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);
}

async function updateExample(databaseProvider: IDatabaseProvider) {
    // const query = update(PERSONS)
    //     .set({ lastname: "Musterfrau" })
    //     .where(r => equals(r.firstname, "Erika"));

    // console.log(query.toSQL());

    // const result = await query.execute(databaseProvider);
    // console.log(result);
}

async function deleteExample(databaseProvider: IDatabaseProvider) {
    // const query = deleteFrom(PERSONS)
    //     .where(r => equals(r.id, 1));

    // console.log(query.toSQL());

    // const result = await query.execute(databaseProvider);
    // console.log(result);
}

async function dropExample(databaseProvider: IDatabaseProvider) {
    // const query = dropTable(PERSONS);
    // console.log(query.toSQL());

    // const result = await query.execute(databaseProvider);
    // console.log(result);
}
