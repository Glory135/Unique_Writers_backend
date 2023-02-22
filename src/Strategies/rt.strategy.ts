import { Injectable } from "@nestjs/common/decorators";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserModel } from "src/Types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @InjectModel('User') private userModel: Model<UserModel>
    ) {
        super({
            jwtFronRequests: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_RT_SECRET,
            passReqToCallback: true
        });
    };
    async validate(req: Request, payload: any) {
        const requestToken = req.get('authorization').replace('Bearer', '').trim();
        const user = await this.userModel.findById(payload.id);
        if(!user){
            throw new UnauthorizedException('Unauthorized user!!');
        }
        return {...user, ...payload, requestToken}
    }
}