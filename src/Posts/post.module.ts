import { Module } from "@nestjs/common";
import { PostController } from "./controllers/posts.controller";
import { PostService } from "./services/post.service";
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from "../Models/post.model";
import { UserSchema } from "../Models/user.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Post', schema: PostSchema },
            { name: 'User', schema: UserSchema }
        ])],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule { }