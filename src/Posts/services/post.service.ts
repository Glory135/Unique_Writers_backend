import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/Models/user.model";
import { Post } from '../../Models/post.model'

@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private postModel: Model<Post>,
        @InjectModel('User') private userModel: Model<User>
    ) { }

    // creating post
    async createPost(writerId: string, body: object) {
        // get writer info
        const writer = await this.userModel.findById(writerId);
        // check if writer exists
        if (!writer) {
            throw new NotFoundException('Not a writer!!')
        }
        // generate writer name for author field
        const writersName = `${writer.lastname} ${writer.firstname}`;
        // create new post
        const newPost = new this.postModel({ id: this.IdIncrease(), writer_id: writerId, author: writersName, ...body })
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
        ).then((result) => {
            return result;
        }).catch((err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
        });
    }

    async deletePodt(writerId: string, postId: string) {
        // get writer info
        const writer = await this.userModel.findById(writerId);
        // get post info
        const post = await this.FindSinglePost(postId);
        // check if writer exists
        if (!writer) {
            throw new NotFoundException('Not a writer!!')
        }
        // comparing writerid so that only writers can delete their posts
        if (writer._id !== post.writer_id) {
            throw new UnauthorizedException('Unauthorized user!!');
        }
        const result = await this.postModel.deleteOne({ _id: postId }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('could not find post!!');
        }
    }

    // UTILITY FUNCTIONS
    
    // function to increase id automatically without getting duplicate
    private async IdIncrease(): Promise<number> {
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