import * as mongoose from 'mongoose';

export interface WriterApplicationModel extends mongoose.Document {
    writerId: string,
    fullname: string,
    username: string,
    message: string,
    status: boolean,
}