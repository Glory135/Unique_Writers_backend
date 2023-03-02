import * as mongoose from 'mongoose';

export const WriterApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: Boolean
    }
},
    { timestamps: true }
)