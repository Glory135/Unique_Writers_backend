import { IsNotEmpty, MinLength } from "class-validator";


export class CreatePost {
    @IsNotEmpty()
    @MinLength(255)
    title: string;

    @IsNotEmpty()
    @MinLength(255)
    story: string;
}