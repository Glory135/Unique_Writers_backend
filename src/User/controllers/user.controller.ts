import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UsePipes } from "@nestjs/common/decorators";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import { UserFromLogin, UserFromReg, UserFromUpdate } from "src/Types";
import { LoginUser, RegisterUser, UpdateUser } from "src/DTOs";
import { ValidationPipe } from "@nestjs/common/pipes";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    // register user POST
    // public
    @Post('register')
    @UsePipes(ValidationPipe)
    async registerUser(
        @Body() body: RegisterUser
    ) {
        return await this.userService.registerUser(body);
    }

    // login user
    // public
    @Post('login')
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
    async grtALlUsers(){
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

    // update user PATCH
    // private
    // middleware VerifyUser.Middleware
    @Patch(':id')
    async updateUserAcct(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() body: UpdateUser
        ) {
        // get  user
        const user = await this.userService.getUser(id);
        if (req.user && user) {
            await this.userService.updateUserAcct(id, body)
            return {
                msg: 'User updated successfully!!'
            };
        }
    }

    // Delete user DELETE 
    // private
    // middleware VerifyUser.Middleware
    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Req() req: Request) {
        // get  user
        const user = await this.userService.getUser(id);
        if (req.user && user) {
            await this.userService.deleteUser(id);
            return {
                msg: 'User deleted successfully!!'
            }
        }        
    }

    
    // logout user POST
    // private
    // middleware VerifyUser.Middleware
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response
    ) {
        // delete token from cookies
        res.clearCookie('jwt');
        return { msg: 'logged out successfully!!' }
    }

}