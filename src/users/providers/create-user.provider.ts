import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    // Inject User Repository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // Inject Hashing Provider
    @Inject(forwardRef(() => HashingProvider)) //Since Auth and User are circular dependency we need to use forwardRef()
    private readonly hashingProvider: HashingProvider,
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
    let newUser = this.usersRepository.create({
      ...createUserDto,
      // Hash the password
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

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
}
