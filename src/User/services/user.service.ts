import { Injectable } from "@nestjs/common/decorators";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { Response } from "express";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException } from "@nestjs/common/exceptions";
import { UserModel } from "src/Types";
import { LoginUser, RegisterUser, UpdateUser } from "src/DTOs";


@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<UserModel>,
        private jwtService: JwtService
    ) { }

    // register user POST
    async registerUser(
        body: RegisterUser
    ) {
        // check if user unique credentials already exists
        const userEmailExists = await this.userModel.findOne({ email: body.email });
        const userNameExists = await this.userModel.findOne({ username: body.username });
        if (userEmailExists) {
            throw new BadRequestException('Email already exists!!')
        }
        if (userNameExists) {
            throw new BadRequestException('Username already exists!!')
        }

        // encrypt password
        const hashedPassword = await this.hashData(body.password);

        // create user
        const newData = new this.userModel({
            id: await this.IdIncrease(),
            firstname: body.firstname,
            lastname: body.lastname,
            username: body.username,
            email: body.email,
            password: hashedPassword,
            isAdmin: false,
            isWriter: false
        })

        // save new user
        const newUser = await newData.save();
        return newUser;
    }

    // login user POST
    async login(res: Response, body: LoginUser) {
        // find user
        const user = await this.userModel.findOne({ username: body.username });
        if (!user) {
            throw new NotFoundException('User does not exist!!');
        }
        // validate password
        if (!await bcrypt.compare(body.password, user.password)) {
            throw new BadRequestException('Incorrect password!!');
        }
        // generate jwt token 
        const jwt = await this.jwtService.signAsync(
            {
                id: user._id,
                email: user.email
            }
        )
        // store token as a cookie
        res.cookie('jwt', jwt, { httpOnly: true })
        return user;
    }

    // get all users
    async getAllUsers() {
        const allUsers = await this.userModel.find().select('-password');
        return allUsers;
    }

    // get single user
    async getUser(id: string) {
        const user = await this.userModel.findById(id).select("-password");
        if (!user) {
            throw new NotFoundException('user not found!!')
        }
        return user
    }

    // update user acct PATCH
    async updateUserAcct(
        id: string,
        body: UpdateUser
    ) {
        await this.userModel.findByIdAndUpdate(id,
            { $set: { ...body } },
            { new: true }
        ).then((result) => {
            return result;
        }).catch((err) => {
            console.log(err);
            throw new InternalServerErrorException();
        });
    }

    // delete user DELETE
    async deleteUser(id: string) {
        const result = await this.userModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('could not find post!!');
        }
    }



    // UTILITY FUNCTIONS 

    // function to hash data
    private async hashData(data: string) {
        const salt = await bcrypt.genSalt(10);
        const hashedData = await bcrypt.hash(data, salt)
        return hashedData
    }

    // function to automatically increase id without getting duplicate  
    private async IdIncrease(): Promise<number> {
        const allUsers = await this.userModel.find();
        let nextId: number;
        if (allUsers.length < 1) {
            nextId = 1;
        } else {
            nextId = allUsers[allUsers.length - 1].id + 1;
        }
        return nextId;
    }
}