import { Controller, Post, Body, Get, Req } from "@nestjs/common";
import { Delete, Param, Patch } from "@nestjs/common/decorators";
import { CreatePost } from "src/DTOs";
import { PostModel } from "src/Types";
import { PostService } from "../services/post.service";

@Controller('/post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    // creating POST
    // private
    // middleware VerifyUser.Middleware
    @Post(':id')
    async createPost(
        @Param('id') userId: string,
        @Body() body: CreatePost,
    ): Promise<PostModel>
    {
        const result = await this.postService.createPost(userId, body);
        return result;
    }

    // getting all posts
    // public
    @Get()
    async getAllPosts(): Promise<PostModel[]> {
        const result = await this.postService.getAllPosts();
        return result;
    }

    // getting single post
    // public
    @Get(':id')
    async getSinglePost(@Param('id') id: string): Promise<PostModel> {
        const result = await this.postService.getSinglePost(id);
        return result;
    }

    // editting post
    // private
    // middleware VerifyUser.Middleware
    @Patch(':userId/:postId')
    async updatePost(
        @Param('userId') userId: string,
        @Param('postId') postId: string,
        @Body() body: CreatePost
    ) {
        await this.postService.updatePost(userId, postId, body);
        return { msg: 'Post updated successfully!!' };
    }

    // delete post
    // private
    // middleware VerifyUser.Middleware
    @Delete(':writerId/:postId')
    async deletePodt(
        @Param('writerId') writerId: string,
        @Param('postId') postId: string
    ) {
        await this.postService.deletePost(writerId, postId);
        return { msg: 'deleted successfully!!' };
    }
}