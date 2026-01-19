import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostService {
  constructor(
    // INJECTING USERS SERVICE IF NEEDED
    private readonly usersService: UsersService,
  ) {}
  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      {
        userId: user,
        title: 'First Post',
        content: 'This is the first post',
      },
      {
        userId: user,
        title: 'Second Post',
        content: 'This is the second post',
      },
    ];
  }
}
