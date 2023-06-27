import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Request,
  Session,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './userservice';
import { User } from 'src/models/orm_models/user.entity';
import { Friend } from 'src/models/orm_models/friend.entity';


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

    @Post()
    async create(@Body() user: User): Promise<User> {
      return this.userService.create(user);
    }

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

  @Get('user/:id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
	return this.userService.findOne(id);
  }

  @Put(':id/update/points/:points')
  async updatePoints(
	@Param('id', ParseIntPipe) id: number,
	@Param('points', ParseIntPipe) points: number,
	  ): Promise<void> {
	await this.userService.updatePoints(id, points);
	  }

  @Get('users/points')
  async getUsersOrderedByPoints(): Promise<User[]> {
	return this.userService.getUsersOrderedByPoints();
  }

}
