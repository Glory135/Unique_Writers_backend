import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePost } from "src/DTOs";
import { PostModel, UserModel } from "src/Types";

@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private postModel: Model<PostModel>,
        @InjectModel('User') private userModel: Model<UserModel>
    ) { }
    
    // creating post
    async createPost(userId: string, body: CreatePost): Promise<PostModel> {
        // check if user is a writer
        const user = await this.writerCheck(userId)
        // generate writer name for author field
        const writersName = `${user.lastname} ${user.firstname}`;
        // create new post
        const newPost = new this.postModel({
            id: await this.IdIncrease(),
            writer_id: userId,
            author: writersName,
            ...body
        })
        const result = await newPost.save()
        return result;
    }

    // getting all posts
    async getAllPosts(): Promise<PostModel[]> {
        const posts = await this.postModel.find().exec()
        return posts;
    }

    // getting single post
    async getSinglePost(id: string): Promise<PostModel> {
        const post = await this.FindSinglePost(id);
        return post;
    }

    // editting post
    async updatePost(userId: string, postId: string, body: CreatePost) {
        // check if user is a writer
        const user = await this.writerCheck(userId);
        // check if post belongs to writer
        await this.postForWriter(user._id, postId);
        // update post
        await this.postModel.findByIdAndUpdate(postId,
            { $set: { ...body } },
            { new: true }
        ).then((result) => {
            return result;
        }).catch((err) => {
            throw new InternalServerErrorException(err);
        });
    }

    async deletePost(userId: string, postId: string): Promise<void> {
        // check if user is a writer
        const user = await this.writerCheck(userId);
        // check if post belongs to writer
        await this.postForWriter(user._id, postId);
        // delete post
        const result = await this.postModel.deleteOne({ _id: postId }).exec();
        // check if post was deleted
        if (result.deletedCount === 0) {
            throw new NotFoundException('could not find post!!');
        }
    }

    // UTILITY FUNCTIONS

    // function to check if user is a writer
    private async writerCheck(userId: string): Promise<UserModel> {
        // get writer info
        const user = await this.userModel.findById(userId).exec();
        // check if user exists
        if (!user) {
            throw new NotFoundException('User not found!!')
        }
        // check if user is a writer
        if (!user.isWriter) {
            throw new BadRequestException('Not a writer!!')
        }
        return user
    }

    // function to check if post belongs to writer
    private async postForWriter(writerId: string, postId: string): Promise<void> {
        // get writer info
        const writer = await this.userModel.findById(writerId);
        // get post info
        const post = await this.FindSinglePost(postId);
        // comparing writerid so that only writers can delete their posts        
        if (!writer._id.equals(post.writer_id)) {
            throw new UnauthorizedException('Unauthorized user!!');
        }
    }

    // function to increase id automatically without getting duplicate
    private async IdIncrease(): Promise<number> {
        const allPosts = await this.postModel.find();
        let nextId: number;
        if (allPosts.length > 0) {
            nextId = allPosts[allPosts.length - 1].id + 1;
        } else {
            nextId = 1
        }
        return nextId;
    }

    // function to find single post and handle error 
    private async FindSinglePost(id: string): Promise<PostModel> {
        let post: PostModel;
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