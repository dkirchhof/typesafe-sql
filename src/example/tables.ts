import { ForeignKey, PrimaryKey, Table } from "../Table";

interface IAlbum {
    id: number;
    name: string;
    artistId: number;
    genreId: number;
}

interface IGenre {
    id: number;
    name: string;
}

interface IArtist {
    id: number;
    name: string;
}

export const artists = new Table<IArtist>("artists", {
    id: { dataType: "INTEGER" },
    name: { dataType: "TEXT" },
}, [
    new PrimaryKey("id"),
]);

export const genres = new Table<IGenre>("genres", {
    id: { dataType: "INTEGER" },
    name: { dataType: "TEXT" },
}, [
    new PrimaryKey("id"),
]);

export const albums = new Table<IAlbum>("albums", {
    id: { dataType: "INTEGER" },
    name: { dataType: "TEXT" },

    artistId: { dataType: "INTEGER" },
    genreId: { dataType: "INTEGER" },
}, [
    new PrimaryKey("id"),
    new ForeignKey("artistId", artists, "id", "CASCADE"),
    new ForeignKey("genreId", genres, "id", "CASCADE"),
]);

export const test = new Table<{ date: Date }>("test", {
    date: {
        converter: {
            toDB: date => date.getTime(),
            toJS: date => new Date(date),
        },
        dataType: "INTEGER",
    },
});
