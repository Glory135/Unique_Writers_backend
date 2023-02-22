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
    },
    writer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }
},
    { timestamps: true }
)