import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    // Injecting user service to check user exists
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  public login(email: string, password: string, id: string) {
    const user = this.userService.findOneById('123');
    // Check user exists
    // login
    // return token
    return 'sample token';
  }

  public isAuth() {
    return true;
  }
}
