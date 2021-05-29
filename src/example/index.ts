import { open } from "sqlite";
import { Database } from "sqlite3";

import { avg, count } from "../Aggregation";
import { equal, moreThan, or } from "../Predicate";
import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { SQLiteProvider } from "../providers/SQLiteProvider";
import { createTable, deleteFrom, dropTable, from, insertInto, update } from "../queries";
import { Table } from "../Table";
import { albums, artists, genres, test } from "./tables";

(async () => {
    const db = await open({ 
        driver: Database, 
        filename: ":memory:",
    });

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
    await selectArtist1OrArtist2(databaseProvider);
    await subQueryTest(databaseProvider);

    await updateAlbumName(databaseProvider);

    await deleteGenrePunk(databaseProvider);
    await selectAlbumsWithArtistAndGenre(databaseProvider);
    
    await dropAlbumsTable(databaseProvider);

    // converter test
    await createExampleTable(test, databaseProvider);
    await insertDateToTestTable(databaseProvider);
    await updateDateInTestTable(databaseProvider);
    await getDateFromTestTable(databaseProvider);

    db.close();
})();

async function createExampleTable(table: Table<any>, databaseProvider: IDatabaseProvider) {
    const query = createTable(table);
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
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

    console.log();
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

    console.log();
}

async function insertAlbums(databaseProvider: IDatabaseProvider) {
    const query = insertInto(albums)
        .values([
            { id: 1, name: "Hollow Crown", artistId: 1, genreId: 1 },
            { id: 2, name: "Lost Forever / Lost Together", artistId: 1, genreId: 1 },

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

    console.log();
}

async function selectAlbumsWithArtistAndGenre(databaseProvider: IDatabaseProvider) {
    const query = from(albums, "album")
        .join("LEFT OUTER", artists, "artist", r => equal(r.album.artistId, r.artist.id))
        .join("LEFT OUTER", genres, "genre", r => equal(r.album.genreId, r.genre.id))
        .select(r => ({ album: r.album.name, artist: r.artist.name, genre: r.genre.name }));
        
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}

async function selectGenresWithMoreThan5Albums(databaseProvider: IDatabaseProvider) {
    const query = from(albums, "album")
        .join("LEFT OUTER", genres, "genre", r => equal(r.album.genreId, r.genre.id))
        .groupBy(r => r.album.genreId)
        .having(r => moreThan(count(r.album.name), 5))
        .select(r => ({ genre: r.genre.name, numberOfAlbums: count(r.album.name) }));
        
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}

async function selectArtist1OrArtist2(databaseProvider: IDatabaseProvider) {
    const query = from(artists, "artist")
        .where(r => or(
            equal(r.artist.id, 1), 
            equal(r.artist.id, 2),
        ))
        .select(r => r.artist);
        
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}

async function subQueryTest(databaseProvider: IDatabaseProvider) {
    const subQuery = from(albums)
        .select(r => ({ singleValue: avg(r.root.id) }));

    const query = from(albums)
        .where(r => moreThan(r.root.id, subQuery))
        .select(r => r.root);

    // const subQuery = from(albums, "a")
    //     .select(r => ({ singleValue: r.a.id }));

    // const query = from(albums)
    //     .where(r => isIn(r.root.id, subQuery))
    //     .select(r => r.root);

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}

async function updateAlbumName(databaseProvider: IDatabaseProvider) {
    console.log("before");
    console.log(await from(albums, "album").where(r => equal(r.album.id, 2)).select(r => ({ ...r.album })).execute(databaseProvider));
    
    const query = update(albums)
        .set({ name: "Lost Forever // Lost Together" })
        .where(r => equal(r.name, "Lost Forever / Lost Together"));
    
    console.log(query.toSQL());
    
    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log("after");
    console.log(await from(albums, "album").where(r => equal(r.album.id, 2)).select(r => ({ ...r.album })).execute(databaseProvider));

    console.log();
}

async function deleteGenrePunk(databaseProvider: IDatabaseProvider) {
    const query = deleteFrom(genres)
        .where(r => equal(r.name, "Punk"));

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}

async function dropAlbumsTable(databaseProvider: IDatabaseProvider) {
    const query = dropTable(albums);
    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}

async function insertDateToTestTable(databaseProvider: IDatabaseProvider) {
    const query = insertInto(test)
        .values({ date: new Date() });

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}

async function getDateFromTestTable(databaseProvider: IDatabaseProvider) {
    const query = from(test)
        .where(r => moreThan(r.root.date, new Date(0)))
        .select(r => r.root);

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}

async function updateDateInTestTable(databaseProvider: IDatabaseProvider) {
    const query = update(test)
        .set({ date: new Date("2018-01-01") });

    console.log(query.toSQL());

    const result = await query.execute(databaseProvider);
    console.log(result);

    console.log();
}
