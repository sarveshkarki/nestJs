import { Body, Controller, Post } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'The tag has been created.' })
  @Post()
  public create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }
}
