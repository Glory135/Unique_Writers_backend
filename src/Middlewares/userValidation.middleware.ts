import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { UserModel } from "src/Types";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class UserValidation implements NestMiddleware {
    constructor(
        @InjectModel('User') private userModel: Model<UserModel>,
        private jwtService: JwtService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const cookie = req.cookies['jwt'];
        const userData = await this.jwtService.verifyAsync(cookie)
        if (!userData) {
            throw new UnauthorizedException()
        }
        const user = await this.userModel.findOne({ _id: userData.id, email: userData.email }).select("-password").select("-refresh_token");
        req.user = user;
        next();
    }
}