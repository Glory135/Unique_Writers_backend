import { Injectable, Req } from "@nestjs/common/decorators";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../Models/user.model";
import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common/exceptions";


@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    // register user POST
    async registerUser(
        body: {
            firstname: string,
            lastname: string,
            username: string,
            email: string,
            password: string,
        }) {
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt)
        // create user
        const newData = new this.userModel({ id: await this.IdIncrease(), firstname: body.firstname, lastname: body.lastname, username: body.username, email: body.email, password: hashedPassword })
        const newUser = await newData.save();
        return newUser;
    }

    // login user POST
    async login(
        body: {
            response: Response,
            username: string,
            password: string
        }
    ) {
        // find user
        const user = await this.userModel.findOne({ username: body.username });
        if (!user) {
            throw new NotFoundException('User does not exist!!');
        }
        // validate password
        if (!await bcrypt.compare(body.password, user.password)) {
            throw new BadRequestException('Incorrect password!!');
        }
        // generate jwt token and store it as a cookie
        const jwt = await this.jwtService.signAsync({ id: user._id, email: user.email })
        body.response.cookie('jwt', jwt, { httpOnly: true })
        return user;
    }

    // get single user
    async getUser(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('user not found!!')
        }
        return user
    }

    // verify user GET
    async verifyUser(data: { req: Request, id: string, email: string }) {
        try {
            const cookie = data.req.cookies['jwt'];
            const userData = await this.jwtService.verifyAsync(cookie)
            if (!userData) {
                throw new UnauthorizedException()
            }

            const user = await this.userModel.findOne({ _id: data.id, email: data.email })
            delete user.password
            return user;
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException()
        }
    }


    // update user acct PATCH
    async updateUserAcct(
        id: string,
        body: {
            firstname: string,
            lastname: string,
            username: string,
            displayname: string
        }) {
        await this.userModel.findByIdAndUpdate(id,
            { $set: { ...body } },
            { new: true }
        ).then((result) => {
            return result;
        }).catch((err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
        });
    }

    // delete user DELETE
    async deleteUser(id: string) {
        const result = await this.userModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('could not find post!!');
        }
    }


    // function to increase id automatically without getting duplicate  
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