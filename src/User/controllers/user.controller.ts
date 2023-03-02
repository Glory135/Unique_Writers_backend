import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UsePipes } from "@nestjs/common/decorators";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import { LoginUser, RegisterUser, UpdateUser, CreateWriterApplication, ChangePassword } from "src/DTOs";
import { ValidationPipe } from "@nestjs/common/pipes";
import { UnauthorizedException } from "@nestjs/common";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    // register user POST
    // public
    @Post('register')
    // to use the user input validator from class-validator
    @UsePipes(ValidationPipe)
    async registerUser(
        @Body() body: RegisterUser
    ) {
        return await this.userService.registerUser(body);
    }

    // login user
    // public
    @Post('login')
    // to use the user input validator from class-validator
    @UsePipes(ValidationPipe)
    async login(
        @Body() body: LoginUser,
        @Res({ passthrough: true }) res: Response
    ) {
        const user = await this.userService.login(res, body)
        if (user) {
            return { msg: 'logged in successfilly' }
        }
    }

    // get all users
    // public
    @Get('all')
    async grtALlUsers() {
        // get users
        const users = await this.userService.getAllUsers();
        return users
    }

    // Get single user GET
    // public
    @Get(':id')
    async user(@Param('id') id: string) {
        // get  user
        const user = await this.userService.getUser(id);
        return user
    }

    // create writer application POST
    // private
    // middleware ValidateUser middleware
    @Post('writer/application')
    // to use the user input validator from class-validator
    @UsePipes(ValidationPipe)
    async createWriterApplication(
        @Req() req: Request,
        @Body() body: CreateWriterApplication,
    ) {
        const userId = req.user['_id'];
        return await this.userService.createWriterApplication(body, userId);
    }

    // update user PATCH
    // private
    // middleware VerifyUser.Middleware
    @Patch(':id')
    // to use the user input validator from class-validator
    @UsePipes(ValidationPipe)
    async updateUserAcct(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() body: UpdateUser
    ) {
        // get  user
        const user = await this.userService.getUser(id);
        if (req.user && user && req.user['_id'].equals(user._id)) {
            await this.userService.updateUserAcct(id, body)
            return {
                msg: 'Your account has been updated successfully!!'
            };
        } else {
            throw new UnauthorizedException('unauthorised user!!')
        }
    }

    // change user password PATCH
    // private
    // middleware VerifyUser.Middleware
    @Post('changePassword/:id')
    // to use the user input validator from class-validator
    @UsePipes(ValidationPipe)
    async changePassword(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() body: ChangePassword
    ) {
        // get  user
        const user = await this.userService.getUser(id);
        if (req.user && user && req.user['_id'].equals(user._id)) {
            await this.userService.changePassword(id, body)
            return {
                msg: 'Your Password has been changed successfully!!'
            };
        } else {
            throw new UnauthorizedException('unauthorised user!!')
        }
    }

    // Delete user DELETE 
    // private
    // middleware VerifyUser.Middleware
    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Req() req: Request) {
        // get  user
        const user = await this.userService.getUser(id);
        if (req.user && user && req.user['_id'].equals(user._id)) {
            await this.userService.deleteUser(id);
            return {
                msg: 'Your account has been deleted successfully!!'
            }
        }
    }


    // logout user POST
    // private
    // middleware VerifyUser.Middleware
    @Post('logout/:id')
    async logout(
        @Res({ passthrough: true }) res: Response,
        @Param('id') id: string
    ) {
        await this.userService.logout(id, res)
        return { msg: 'logged out successfully!!' }
    }

}