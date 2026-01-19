import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostsDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(
    // Injecting PostService
    private readonly postService: PostService,
  ) {}

  @Get('{/:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.postService.findAll(userId);
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been created.' })
  @Post()
  public createPost(@Body() createPostsDto: CreatePostsDto) {
    console.log('createPostDto', createPostsDto);
    return 'Post created successfully';
  }

  @ApiOperation({ summary: 'Updates post' })
  @ApiResponse({ status: 200, description: 'The post has been updated.' })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
  }
}
