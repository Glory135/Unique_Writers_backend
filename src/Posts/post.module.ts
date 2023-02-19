import { Module } from "@nestjs/common";
import { PostController } from "./controllers/posts.controller";
import { PostService } from "./services/post.service";
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from "./post.model";

@Module({
    imports : [MongooseModule.forFeature([{name: 'Post', schema: PostSchema}])],
    controllers:[PostController],
    providers:[PostService]
})
export class PostModule{}