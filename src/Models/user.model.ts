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

export interface User extends mongoose.Document {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
    displayname: string,
    email: string,
    password: string,
    isWriter: boolean,
    isAdmin: boolean,
    profilePic: object
}