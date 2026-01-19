import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePostsDto } from './create-post.dto';

export class PatchPostDto extends PartialType(CreatePostsDto) {
  @ApiProperty({ description: 'ID of the post to be updated', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
