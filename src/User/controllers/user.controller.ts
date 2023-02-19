import { Body, Controller, Get, Param, Patch, Post, Req, Res } from "@nestjs/common/decorators";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    // register user POST
    @Post('register')
    async registerUser(
        @Body() body: {
            firstname: string,
            lastname: string,
            username: string,
            email: string,
            password: string,
        }) {
        const user = await this.userService.registerUser(body);
        delete user.password
        return user
    }

    @Post('login')
    async login(@Body() body: { username: string, password: string }, @Res({ passthrough: true }) res: Response) {
        const user = await this.userService.login({ response: res, ...body })
        if (user) {
            return { msg: 'success' }
        }
    }

    // verify user GET
    @Get(':id')
    async user(@Req() req: Request, @Param('id') id: string) {
        // get single user
        const user = await this.userService.getUser(id);
        // validate user
        const verifiedUser = await this.userService.verifyUser({ req, id: user._id, email: user.email })
        return verifiedUser
    }

    // update user PATCH
    @Patch(':id')
    async updateUserAcct(@Param('id') id: string, @Body() body: object){
        
    }

    // logout user POST
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response
    ) {
        // delete token from cookies
        res.clearCookie('jwt');
        return { msg: 'logged out successfully!!' }
    }

}