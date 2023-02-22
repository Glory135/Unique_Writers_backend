import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
    },
    displayname: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refresh_token:{
        type: String
    },
    isWriter: {
        type: Boolean,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    profilePic: {
        type: Object
    }
},
    { timestamps: true }
);