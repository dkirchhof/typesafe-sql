import { ForeignKey, Table } from "../Table";

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
    id: { dataType: "INTEGER", primary: true },
    name: { dataType: "TEXT" },
});

export const genres = new Table<IGenre>("genres", {
    id: { dataType: "INTEGER", primary: true },
    name: { dataType: "TEXT" },
});

export const albums = new Table<IAlbum>("albums", {
    id: { dataType: "INTEGER", primary: true },
    name: { dataType: "TEXT" },

    artistId: { dataType: "INTEGER", references: new ForeignKey(() => artists, "id", "CASCADE") },
    genreId: { dataType: "INTEGER", references: new ForeignKey(() => genres, "id", "CASCADE") },
});

export const test = new Table<{ date: Date }>("test", {
    date: {
        converter: { 
            toDB: date => date.getTime(),
            toJS: date => new Date(date),
        },
        dataType: "INTEGER",
    },
});
