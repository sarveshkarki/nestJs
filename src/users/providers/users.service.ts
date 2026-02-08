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
    // Check if user already exists with the same email
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException(
          'User already exists, please check your email.',
        );
      }
    } catch (error) {
      console.error('DB ERROR:', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    // Handle exception if user exists

    // Create a new user entity
    let newUser = this.usersRepository.create(createUserDto);

    // Save the new user to the database
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // Auth service
    // const isAuth = this.authService.isAuth();
    // console.log('isAuth', isAuth);
    return [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
    ];
  }

  //   find one by id
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }
}
