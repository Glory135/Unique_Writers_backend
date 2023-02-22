import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserSchema } from "../Models/user.model";
import { MiddlewareConsumer, NestModule } from "@nestjs/common/interfaces";
import { UserValidation } from "src/Middlewares/userValidation.middleware";
import { RequestMethod } from "@nestjs/common/enums";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' }
        }),
    ],
    controllers: [UserController],
    providers: [UserService]
})

export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserValidation)
            .forRoutes(
                {
                    path: 'user/:id',
                    method: RequestMethod.PATCH
                },
                {
                    path: 'user/:id',
                    method: RequestMethod.DELETE
                },
                {
                    path: 'user/logout',
                    method: RequestMethod.POST
                },
            )
    }
}