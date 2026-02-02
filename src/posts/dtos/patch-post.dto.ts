import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ description: 'ID of the post to be updated', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
