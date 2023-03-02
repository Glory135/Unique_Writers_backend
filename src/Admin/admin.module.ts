import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin/admin.controller';
import { AdminUser } from './providers/admin-user/admin-user';
import { AdminPost } from './providers/admin-post/admin-post';

@Module({
  controllers: [AdminController],
  providers: [AdminUser, AdminPost]
})
export class AdminModule {}
