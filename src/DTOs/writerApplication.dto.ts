import { IsNotEmpty, MinLength } from "class-validator";

export class CreateWriterApplication{
    @IsNotEmpty()
    @MinLength(10)
    message: string;
}