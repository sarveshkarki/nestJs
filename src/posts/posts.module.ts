import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PostService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [UsersModule, TypeOrmModule.forFeature([Post])],
})
export class PostModule {}
