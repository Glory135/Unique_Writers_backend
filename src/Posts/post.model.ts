import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    poster: {
        type: Object,
        // required: true
    }
},
    { timestamps: true }
)

export interface Post extends mongoose.Document {
    id: number,
    title: string,
    author: string,
    story: string,
    poster: object,
}