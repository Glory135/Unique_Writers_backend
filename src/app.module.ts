import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './Models/user.model';
import { PostModule } from './Posts/post.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PostModule,
    UserModule,
    ],
})
export class AppModule { }
