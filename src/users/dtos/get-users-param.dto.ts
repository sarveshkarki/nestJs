import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetUsersParamDto {
  @ApiPropertyOptional({ description: 'The ID of the user', example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
