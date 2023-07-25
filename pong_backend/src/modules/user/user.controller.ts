import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Delete,
  Request,
  Session,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './userservice';
import { User } from 'src/models/orm_models/user.entity';
import { Friend } from 'src/models/orm_models/friend.entity';
import { UserDTO } from './userDTO';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.userService.remove(id);
  }

  @Get('login/:id')
  @ApiOperation({ summary: 'Login a user' })
  async loginUser(
    @Param('id', ParseIntPipe) userID: number,
    @Session() session: Record<string, any>,
  ) {
    session.userID = userID;
    console.log(userID);
    return 'Loged in with id: ' + userID;
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get a user by his id' })
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id/update/points/:points')
  @ApiOperation({ summary: 'Update the points of a user' })
  async updatePoints(
    @Param('id', ParseIntPipe) id: number,
    @Param('points', ParseIntPipe) points: number,
  ): Promise<void> {
    await this.userService.updatePoints(id, points);
  }

  @Put(':id/update/avatar/:avatar')
  @ApiOperation({ summary: 'Update the profile avatar of a user' })
  async updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Param('avatar') newAvatar: string,
  ): Promise<void> {
    await this.userService.updateAvatar(id, newAvatar);
  }

  @Get('users/points')
  @ApiOperation({ summary: 'Get top 10 users ordered by points' })
  async getUsersOrderedByPoints(): Promise<User[]> {
    return this.userService.getUsersOrderedByPoints();
  }

  @Get('user/login')
  @ApiOperation({ summary: 'Get the user logged in' })
  async getUserLoggedIn(@Body() user: UserDTO): Promise<User> {
	return this.userService.getUserLoggedIn(user);
  }

  @Post('user/login')
  @ApiOperation({ summary: 'Post the user logged in' })
  async postUserLoggedIn(@Body() userDto: UserDTO): Promise<User> {
	return this.userService.postUserLoggedIn(userDto);
  }

  @Post(':userId/:password/login/confirm')
  @ApiOperation({ summary: 'Confirm the user logged in' })
  async confirmUserLoggedIn(
	@Param('userId', ParseIntPipe) userId: number,
	@Param('password') password: string,
	  ): Promise<boolean> {
	return this.userService.confirmUserLoggedIn(userId, password);
	  }

  @Put(':id/:password/update/password')
  @ApiOperation({ summary: 'Update the password of a user' })
  async updatePassword(
	@Param('id', ParseIntPipe) id: number,
	@Param('password') password: string,
	  ): Promise<void> {
	await this.userService.updateUserPassword(id, password);
	  }
}
