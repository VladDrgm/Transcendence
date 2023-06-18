import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Request,
  Session,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './userservice';
import { User } from 'src/models/orm_models/user.entity';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  //   @Get(':id')
  //   async findOne(@Param('id') id: number): Promise<User> {
  //     return this.userService.findOne(id);
  //   }

  //   @Post()
  //   async create(@Body() user: User): Promise<User> {
  //     return this.userService.create(user);
  //   }

  //   @Delete(':id')
  //   async remove(@Param('id') id: number): Promise<void> {
  //     await this.userService.remove(id);
  //   }
  // }

  // @Get()
  // getUser(): string {
  //   return 'This is public prdile of a user ';
  // }

  @Get('login/:id')
  async loginUser(
    @Param('id', ParseIntPipe) userID: number,
    @Session() session: Record<string, any>,
  ) {
    session.userID = userID;
    console.log(userID);
    return 'Loged in with id: ' + userID;
  }

  @Get(':id/friends')
  async getUserFriends(@Param('id') id: number) {
    const friends = await this.userService.findUserFriends(id);
    return friends;
  }

  // @Get(':friendId')
  // async getFriendById(@Param('friendId') friendId: number): Promise<User> {
  //   return this.userService.findFriendById(friendId);
  // }
}
