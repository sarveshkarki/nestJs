import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    // Injecting UsersService if needed in future
    private readonly usersService: UsersService,
  ) {}
  @Get('{/:id}')
  @ApiOperation({ summary: 'Get users with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    // schema can be added here for better documentation
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit number of users returned',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
  ) {
    return this.usersService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  public createUsers(@Body() creteUserDto: CreateUserDto) {
    console.log('creteUserDto', typeof creteUserDto);
    console.log('creteUserDto', creteUserDto instanceof CreateUserDto);

    return 'Create user';
  }

  @Patch()
  public patchUsers(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
