import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { UserModel } from "src/Types";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserValidation implements NestMiddleware {
    constructor(
        @InjectModel('User') private userModel: Model<UserModel>,
        private jwtService: JwtService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        // get tokens
        const access_token = req.cookies['jwt-access'];
        const refresh_token = req.cookies['jwt-refresh'];
        // decode access token to get expiration
        if(!access_token || !refresh_token){
            throw new UnauthorizedException("invalid user!!!")
        }
        const decodedToken = this.jwtService.decode(access_token);        
        const exp = decodedToken['exp'];
        // check if its expired
        const isExpired = exp * 1000 < Date.now();

        // if access token expires we check if refresh token is still valid to use it to generate new access token
        if (isExpired) {
            // get refresh token and use it to genetate a new acces token
            console.log('expired');
            
            await this.refGenAcc(decodedToken["id"], decodedToken['email'], refresh_token, res)
        }
        

        // get user data by varifying access token
        const userData = await this.jwtService.verifyAsync(access_token, {secret: process.env.JWT_AT_SECRET});
        
        if (!userData) {
            throw new UnauthorizedException("invalid user!!!")
        }
        // use data gotten from verification to get user from DB
        const user = await this.userModel.findOne({ _id: userData.id, email: userData.email }).select("-password").select("-refresh_token");
        // return user
        req.user = user;
        next();
    }

    // UTILITY functions

    // get refresh token and use it to genetate a new acces token
    private async refGenAcc(id: string, email: string, refreshToken: string, res: Response) {
        // get hashed refresh token stored in DB
        const hashedRef = (await this.userModel.findOne({ _id: id, email })).refresh_token;
        if (!hashedRef) {
            throw new UnauthorizedException("invalid user!!!")
        }

        // comparing refresh tokens
        const tokenMatches = await bcrypt.compare(refreshToken, hashedRef)
        if (!tokenMatches) {
            throw new UnauthorizedException("invalid user!!!")
        }

        // verify refreah token
        const userData = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_RT_SECRET});
        if(!userData){
            throw new UnauthorizedException("invalid user!!!")
        }

        // generate new access token
        const newAccessToken = await this.jwtService.signAsync(
            { id: userData.id, email: userData.email },
            {
                secret: process.env.JWT_AT_SECRET,
                expiresIn: 60 * 60,
            }
        )

        // store new access token as cookie
        res.cookie('jwt-access', newAccessToken, { httpOnly: true })
    }
}