import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(
    // Injecting PostService
    private readonly postService: PostService,
  ) {}

  @Get('{/:userId}')
  public getPosts(@Param('userId') userId: number) {
    return this.postService.findAll(userId);
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been created.' })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @ApiOperation({ summary: 'Updates post' })
  @ApiResponse({ status: 200, description: 'The post has been updated.' })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postService.update(patchPostDto);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'The post has been deleted.' })
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }
}
