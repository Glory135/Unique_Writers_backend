import * as mongoose from "mongoose";

export interface PostModel extends mongoose.Document {
    id: number,
    title: string,
    author: string,
    story: string,
    poster: {
        poster: string,
        url: string,
    },
    writer_id: mongoose.ObjectId
}
