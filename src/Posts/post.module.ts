import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { PostController } from "./controllers/posts.controller";
import { PostService } from "./services/post.service";
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from "../Models/post.model";
import { UserSchema } from "../Models/user.model";
import { UserValidation } from "src/Middlewares/userValidation.middleware";
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
export class PostModule implements NestModule{ 
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserValidation)
            .forRoutes(
                {
                    path: 'post/:id',
                    method: RequestMethod.POST
                },
                {
                    path: 'post/:writerId/:postId',
                    method: RequestMethod.PATCH
                },
                {
                    path: 'post/:writerId/:postId',
                    method: RequestMethod.DELETE
                },
            )
    }
}