import { Controller, Post, Body, Get } from "@nestjs/common";
import { Delete, Param, Patch, Req, UsePipes } from "@nestjs/common/decorators";
import { CreatePost } from "src/DTOs";
import { PostModel } from "src/Types";
import { PostService } from "../services/post.service";
import { ValidationPipe } from "@nestjs/common/pipes";
import { Request } from 'express';


@Controller('/post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    // creating POST
    // private
    // middleware VerifyUser.Middleware
    @Post()
    // to use the user input validator from class-validator
    @UsePipes(ValidationPipe)
    async createPost(
        @Req() req: Request,
        @Body() body: CreatePost,
    ): Promise<PostModel> {
        console.log(req.user);
        const userId = req.user['_id']
        const result = await this.postService.createPost(userId, body);
        return result;
    }

    // getting all posts
    // public
    @Get('all')
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
    @Patch(':postId')
    // to use the user input validator from class-validator
    @UsePipes(ValidationPipe)
    async updatePost(
        @Req() req: Request,
        @Param('postId') postId: string,
        @Body() body: CreatePost
    ) {
        const userId = req.user['_id'];
        await this.postService.updatePost(userId, postId, body);
        return { msg: 'Post updated successfully!!' };
    }

    // delete post
    // private
    // middleware VerifyUser.Middleware
    @Delete(':postId')
    async deletePodt(
        @Req() req: Request,
        @Param('postId') postId: string
    ) {
        const userId = req.user['_id'];
        await this.postService.deletePost(userId, postId);
        return { msg: 'Post deleted successfully!!' };
    }
}