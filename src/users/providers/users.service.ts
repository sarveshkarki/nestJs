import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { User } from '../user.entity';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';

@Injectable()
export class UsersService {
  //  injecting Auth Service
  // constructor(
  //   @Inject(forwardRef(() => AuthService))
  //   private readonly authService: AuthService,
  // ) {}

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // Inject usersCreateMany many provider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // Inject createUserProvider
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  // Create the user
  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  // Find all the users
  public async findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    let users = await this.usersRepository.find();
    return users;
    // Auth service
    // const isAuth = this.authService.isAuth();
    // console.log('isAuth', isAuth);
  }

  // find one by id
  public async findOneById(id: number) {
    let user;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }
    if (!user) {
      throw new BadRequestException('The user does not exist.');
    }
    return user;
  }

  // Create many users
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }
}
