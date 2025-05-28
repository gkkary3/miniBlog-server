import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entity/post.entity';
import { User } from '../../entity/user.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Comment } from 'src/entity/comments.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment]), UserModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
