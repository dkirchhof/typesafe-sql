# typesafe-sql

This library provides a typesafe sql query builder for nodejs (using typescript).
There arent't any specific dialects implemented. The resulting sql queries use the standard sql language.

## Installation
```sh
# install library
$ yarn add typesafe-sql

# install database drivers like sqlite
$ yarn add sqlite
```

## Usage

open database and create a provider
```ts
import { open } from "sqlite";
import { Database } from "sqlite3";
import { SQLiteProvider } from "typesafe-sql";

const db = await open({
    driver: Database,
    filename: ":memory:",
});

const databaseProvider = new SQLiteProvider(db);
```

define a table
```ts
interface IAlbum {
    id: number;
    name: string;
    artistId: number;
    genreId: number;
}

const albums = new Table<IAlbum>("albums", {
    id: { dataType: "INTEGER" },
    name: { dataType: "TEXT" },
}, [
    new PrimaryKey("id"),
]);
```

create table
```ts
await createTable(albums)
    .execute(databaseProvider);
```
```sql
CREATE TABLE albums (
  id INTEGER NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
)
```

insert data
```ts
await insertInto(albums)
    .values({
        id: 1,
        name: "Hollow Crown",
    })
    .execute(databaseProvider);
```
```sql
INSERT INTO albums(id, name)
  VALUES(1, 'Hollow Crown')
```

select data
```ts
await from(albums)
    .selectAll()
    .execute(databaseProvider);
```
```sql
SELECT *
  FROM albums AS root
```

select joined data
```ts
await from(albums, "album")
    .join("LEFT OUTER", artists, "artist", r => equal(r.album.artistId, r.artist.id))
    .join("LEFT OUTER", genres, "genre", r => equal(r.album.genreId, r.genre.id))
    .select(r => ({ album: r.album.name, artist: r.artist.name, genre: r.genre.name }))
    .execute(databaseProvider);
```
```sql
SELECT album.name AS album, artist.name AS artist, genre.name AS genre
  FROM albums AS album
  LEFT OUTER JOIN artists AS artist ON album.artistId = artist.id
  LEFT OUTER JOIN genres AS genre ON album.genreId = genre.id
```

delete data
```ts
await deleteFrom(albums)
    .where(r => equal(r.name, "Hollow Crown"))
    .execute(databaseProvider);
```
```sql
DELETE FROM albums
  WHERE name = 'Hollow Crown'
```

## Examples
You can find more examples in `example/` folder. Just run `yarn example` to try them out.
