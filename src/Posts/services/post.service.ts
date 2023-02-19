import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post } from '../post.model'

@Injectable()
export class PostService {
    constructor(@InjectModel('Post') private postModel: Model<Post>) { }

    // creating post
    async createPost(body: object) {
        const newPost = new this.postModel({ id: this.IdIncrease(), ...body })
        const result = await newPost.save()
        return result;
    }

    // getting all posts
    async getAllPosts() {
        const posts = await this.postModel.find().exec()
        return posts;
    }

    // getting single post
    async getSinglePost(id: string) {
        const post = await this.FindSinglePost(id);
        return post;
    }

    // editting post
    async updatePost(id: string, body: object) {
        await this.postModel.findByIdAndUpdate(id,
            { $set: { ...body } },
            { new: true }
        ).then(() => {
            return 'Updated Successfully';
        }).catch((err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
        });
    }

    async deletePodt(id: string){
        const result = await this.postModel.deleteOne({_id: id}).exec();
        if(result.deletedCount === 0){
            throw new NotFoundException('could not find post!!');
        }
    }

    // UTILITY FUNCTIONS

    // function to increase id automatically without getting duplicate
    private async IdIncrease():Promise<number> {
        const allPosts = await this.postModel.find();
        const nextId = allPosts[allPosts.length - 1].id + 1;
        return nextId;
    }

    // function to find single post and handle error 
    private async FindSinglePost(id: string): Promise<Post> {
        let post: Post;
        try {
            post = await this.postModel.findById(id).exec();
        } catch (error) {
            console.log(error);
            throw new NotFoundException('Something went wrong whie finding post!!');
        }
        if (!post) {
            throw new NotFoundException('could not find post!!');
        }
        return post;
    }

}