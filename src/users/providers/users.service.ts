import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  //  injecting Auth Service
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // Auth service
    const isAuth = this.authService.isAuth();
    console.log('isAuth', isAuth);
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
  public findOneById(id: string) {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
  }
}
