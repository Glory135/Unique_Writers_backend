import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserSchema } from "../Models/user.model";
import { MiddlewareConsumer, NestModule } from "@nestjs/common/interfaces";
import { UserValidationMiddleware } from "../Middlewares/user-validation/userValidation.middleware";
import { RequestMethod } from "@nestjs/common/enums";
import { ConfigModule } from "@nestjs/config";
import { WriterApplicationSchema } from "../Models/writerApplication.model";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
            { name: 'WriterApplication', schema: WriterApplicationSchema },
        ]),
        JwtModule.register({}),
    ],
    controllers: [UserController],
    providers: [UserService]
})

export class UserModule implements NestModule {
    // use middleware on the following paths
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserValidationMiddleware)
            .forRoutes(
                // create writer application
                {
                    path: 'user/writer/application',
                    method: RequestMethod.POST
                },
                // update user
                {
                    path: 'user/:id',
                    method: RequestMethod.PATCH
                },
                // change user password
                {
                    path: 'user/changePassword/:id',
                    method: RequestMethod.POST
                },
                // delete user
                {
                    path: 'user/:id',
                    method: RequestMethod.DELETE
                },
                // logout user
                {
                    path: 'user/logout/:id',
                    method: RequestMethod.POST
                },
            )
    }
}