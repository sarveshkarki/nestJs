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
    //  INJECTING CONFIG SERVICE
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // Check if user exists
    let existingUser;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.error('DB ERROR:', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later.',
      );
    }
    // Throw an error if user already exits
    if (existingUser) {
      throw new BadRequestException(
        'User already exists, please check your email.',
      );
    }
    // Create new instance of user if user does not already exits
    let newUser = this.usersRepository.create(createUserDto);
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }
    // Save user to the database
    return newUser;
  }

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

  //   find one by id
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
}
