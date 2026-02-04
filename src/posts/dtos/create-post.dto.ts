import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty({ description: 'Title of the post', example: 'My First Post' })
  title: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type of the post',
    example: 'post',
    enum: PostType,
  })
  postType: PostType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.',
  })
  @ApiProperty({
    description:
      'URL-friendly identifier for the post (lowercase letters, numbers, hyphens)',
    example: 'my-first-post',
  })
  slug: string;

  @IsNotEmpty()
  @IsEnum(PostStatus)
  @ApiProperty({
    description: 'Status of the post',
    example: 'draft',
    enum: PostStatus,
  })
  status: PostStatus;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Content of the post in markdown format',
    example: 'This is the **content** of my first post.',
  })
  content?: string;

  @IsOptional()
  @IsJSON()
  @ApiPropertyOptional({
    description: 'Additional JSON schema for the post',
    example: '{"layout": "standard", "commentsEnabled": true}',
  })
  schema?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    description: 'URL of the featured image for the post',
    example: 'https://example.com/images/my-first-post.jpg',
  })
  featuredImageUrl?: string;

  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional({
    description: 'Publication date of the post in ISO 8601 format',
    example: '2024-12-31T23:59:59Z',
  })
  publishOn?: Date;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiPropertyOptional({
    description: 'Arrays of ids of tags',
    example: [1, 2, 3],
  })
  tags?: number[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'The metaValue is a JSON string',
          example: '{"sidebarEnabled": true,}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;

  @ApiProperty({
    type: 'integer',
    required: true,
    description: 'Tags associated with the post',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
