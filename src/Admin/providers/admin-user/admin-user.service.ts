import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUser } from 'src/DTOs';
import { UserModel } from 'src/Types';

@Injectable()
export class AdminUser {
    constructor(
        @InjectModel('User') private userModel: Model<UserModel>,
    ){}

    // edit user acct - Patch
    async adminEditUser(userId: string, body:UpdateUser){

    }
}
