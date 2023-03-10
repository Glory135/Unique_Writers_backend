import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { PostController } from "./controllers/posts.controller";
import { PostService } from "./services/post.service";
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from "../Models/post.model";
import { UserSchema } from "../Models/user.model";
import { UserValidationMiddleware } from "src/Middlewares/user-validation/userValidation.middleware";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { ConfigModule } from "@nestjs/config";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forFeature([
            { name: 'Post', schema: PostSchema },
            { name: 'User', schema: UserSchema }
        ]),
        JwtModule.register({}),
    ],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule implements NestModule {
    // use middleware on the following paths
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserValidationMiddleware)
            .forRoutes(
                // create post
                {
                    path: 'post',
                    method: RequestMethod.POST
                },
                // update post
                {
                    path: 'post/:postId',
                    method: RequestMethod.PATCH
                },
                // delete post
                {
                    path: 'post/:postId',
                    method: RequestMethod.DELETE
                },
            )
    }
}