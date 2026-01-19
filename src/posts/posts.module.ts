import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PostService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [UsersModule],
})
export class PostModule {}
