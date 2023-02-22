import * as mongoose from "mongoose";

export interface UserModel extends mongoose.Document {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
    displayname: string,
    email: string,
    password: string,
    refresh_token: string,
    isWriter: boolean,
    isAdmin: boolean,
    profilePic: {
        poster: string,
        url: string,
    },
}