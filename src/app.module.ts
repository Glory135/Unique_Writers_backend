import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './Posts/post.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [PostModule, UserModule, MongooseModule.forRoot('mongodb://localhost:27017')],
})
export class AppModule { }
