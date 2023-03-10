import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AdminController } from './controllers/admin/admin.controller';
import { AdminUser } from './providers/admin-user/admin-user.service';
import { AdminPost } from './providers/admin-post/admin-post.service';
import { UserValidationMiddleware } from 'src/Middlewares/user-validation/userValidation.middleware';
import { AdminValidatorMiddleware } from 'src/Middlewares/admin-validator/admin-validator.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PostSchema } from 'src/Models/post.model';
import { UserSchema } from 'src/Models/user.model';
import { WriterApplicationSchema } from 'src/Models/writerApplication.model';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
  }),
  MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
      { name: 'WriterApplication', schema: WriterApplicationSchema },
  ]),
  JwtModule.register({}),
  ],
  controllers: [AdminController],
  providers: [AdminUser, AdminPost]
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      UserValidationMiddleware,
      AdminValidatorMiddleware
    ).forRoutes(
      // update user
      {
        path: 'admin/editUser/:userId',
        method: RequestMethod.POST
      }
    )
  }
}
