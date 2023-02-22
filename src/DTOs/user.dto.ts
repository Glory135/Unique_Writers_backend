import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterUser{
    @MinLength(3)
    firstname: string;

    @MinLength(3)
    lastname: string;

    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(5)
    password: string;
}

export class LoginUser{
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsNotEmpty()
    @MinLength(5)
    password: string;
}

export class UpdateUser{
    @MinLength(3)
    firstname: string;

    @MinLength(3)
    lastname: string;

    @MinLength(3)
    username: string;

    displayname: string;
}