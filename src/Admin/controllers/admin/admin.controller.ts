import { Body, Controller, Param, Post, Patch } from '@nestjs/common';
import { AdminPost } from 'src/Admin/providers/admin-post/admin-post.service';
import { AdminUser } from 'src/Admin/providers/admin-user/admin-user.service';
import { UpdateUser } from 'src/DTOs';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminUserService: AdminUser, 
        private readonly adminPostService: AdminPost 
    ){}

    // edit user account - Patch
    // private
    // middleware ValidateUser middleware, adminvalidator middleware
    @Patch('editUser/:userId')
    async adminEditUser(@Param('userId') userId : string, @Body() body: UpdateUser){
        await this.adminUserService.adminEditUser(userId, body);
    }
}
