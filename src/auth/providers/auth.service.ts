import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    // Injecting user service to check user exists
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // Inject sign in provider
    private readonly signInProvider: SignInProvider,
  ) {}

  public async signIn(singInDto: SignInDto) {
    return await this.signInProvider.signIn(singInDto);
  }

  public isAuth() {
    return true;
  }
}
