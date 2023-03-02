import { IsNotEmpty, MinLength } from "class-validator";


export class CreatePost {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @MinLength(255)
    story: string;
}