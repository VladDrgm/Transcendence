import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './userservice';
import { User } from 'src/models/orm_models/user.entity';
import { UserDTO } from './userDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarDto } from './UploadAvatarDTO';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
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

  @Put(':id/update/username/:username')
  @ApiOperation({ summary: 'Update the username of a user' })
  async updateUsername(
    @Param('id', ParseIntPipe) id: number,
    @Param('username') newUsername: string,
  ): Promise<User> {
    return await this.userService.updateUsername(id, newUsername);
  }

  @Get('users/points')
  @ApiOperation({ summary: 'Get top 10 users ordered by points' })
  async getUsersOrderedByPoints(): Promise<User[]> {
    return this.userService.getUsersOrderedByPoints();
  }

  @Post('user/signup')
  @ApiOperation({ summary: 'Sign up' })
  async postUserLoggedIn(@Body() userDto: UserDTO): Promise<User> {
    return this.userService.postUserLoggedIn(userDto);
  }

  @Post(':userName/:password/login/confirm')
  @ApiOperation({ summary: 'Log in' })
  async confirmUserLoggedIn(
    @Param('userName') userName: string,
    @Param('password') password: string,
  ): Promise<User> {
    return this.userService.confirmUserLoggedIn(userName, password);
  }

  @Put(':id/:password/update/password')
  @ApiOperation({ summary: 'Update the password of a user' })
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('password') password: string,
  ): Promise<User> {
    return await this.userService.updateUserPassword(id, password);
  }

  @Put(':id/update/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarDto })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    await this.userService.updateAvatar(id, file);
  }
}
