import { Controller, Post, Body, Get} from "@nestjs/common";
import { Delete, Param, Patch } from "@nestjs/common/decorators";
import { PostService } from "../services/post.service";

@Controller('/post')
export class PostController{
    constructor(private readonly postService: PostService){}

    // creating post
    @Post()
    async createPost(@Body() body: object){
        const result = await this.postService.createPost(body);
        return result;
    }

    // getting all posts
    @Get()
    async getAllPosts(){
        const result = await this.postService.getAllPosts();
        return result;
    }

    // getting single post
    @Get(':id')
    async getSinglePost(@Param('id') id: string){
        const result = await this.postService.getSinglePost(id);
        return result;
    }

    // editting post
    @Patch(':id')
    async updatePost(@Param('id') id: string, @Body() body: object){
        const result = await this.postService.updatePost(id, body);
        return result;
    }

    // delete post
    @Delete(':id')
    async deletePodt(@Param('id') id: string){
        await this.postService.deletePodt(id);
        return 'deleted successfully!!';
    }
}