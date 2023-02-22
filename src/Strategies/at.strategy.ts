import { Injectable } from "@nestjs/common/decorators";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserModel } from "src/Types";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access'){
    constructor(
        @InjectModel('User') private userModel: Model<UserModel>
    ){
        super({
            jwtFronRequests: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_AT_SECRET
        });
    }
    async validate(payload: any){
        const user = await this.userModel.findById(payload.id);
        if(!user){
            throw new UnauthorizedException('Unauthorized user!!');
        }
        return {...user, ...payload}
    }
}