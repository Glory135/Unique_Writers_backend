import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserSchema } from "../Models/user.model";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' }
        })
    ],
    controllers: [UserController],
    providers: [UserService]
})

export class UserModule { }