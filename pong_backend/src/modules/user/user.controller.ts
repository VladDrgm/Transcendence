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
  Patch
} from '@nestjs/common';
import { UserService } from './userservice';
import { User } from 'src/models/orm_models/user.entity';
import { UserDTO, UserListDto } from './userDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarDto } from './UploadAvatarDTO';
import { UserAuthDTO } from '../authProtectorService/authProtector';
import { GenerateTotpDTO } from '../auth/dto/generate-totp.dto';
import { VerifyTotpDTO } from '../auth/dto/verify-totp.dto';
import { VerifyTotpResponseDTO } from '../auth/dto/verify-totp-response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<UserListDto[]> {
    const users = await this.userService.findAll();
    const result = [];
    for (const user of users) {
      result.push(UserListDto.fromEntity(user));
    }

    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Get('generate-totp')
  @ApiOperation({ summary: 'Generating token for 2FA' })
  async generateTOTP() {
    return this.userService.generateTOTP();
  }

  @Post('/verify-totp')
  verifyTOTP(@Body() verifyTotpDto: VerifyTotpDTO) {
    const { secret, token } = verifyTotpDto;
    return {
      isValid: this.userService.verifyTOTP(secret, token),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.userService.remove(id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get a user by his id' })
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
    return UserDTO.fromEntity(await this.userService.findOne(id));
  }

  @Put(':id/update/points/:callerId/:targetId/:points')
  @ApiOperation({ summary: 'Update the points of a user' })
  async updatePoints(
    @Param('callerId', ParseIntPipe) callerId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
    @Param('points', ParseIntPipe) points: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    await this.userService.updatePoints(loggedUser, callerId, targetId, points);
  }

  @Put(':callerId/:targetId/update/username/:username')
  @ApiOperation({ summary: 'Update the username of a user' })
  async updateUsername(
    @Param('callerId', ParseIntPipe) callerId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
    @Param('username') newUsername: string,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<User> {
    return await this.userService.updateUsername(
      loggedUser,
      callerId,
      targetId,
      newUsername,
    );
  }

  @Get('users/points')
  @ApiOperation({ summary: 'Get top 10 users ordered by points' })
  async getUsersOrderedByPoints() {
    const users = await this.userService.getUsersOrderedByPoints();

    return users;
  }

  //   @Post('user/signup')
  //   @ApiOperation({ summary: 'Sign up' })
  //   async postUserLoggedIn(@Body() userDto: UserDTO): Promise<User> {
  //     return this.userService.postUserLoggedIn(userDto);
  //   }

  @Post(':userName/:password/login/confirm')
  @ApiOperation({ summary: 'Log in' })
  async confirmUserLoggedIn(
    @Param('userName') userName: string,
    @Param('password') password: string,
  ): Promise<User> {
    return this.userService.confirmUserLoggedIn(userName, password);
  }

  @Put(':callerId/:targetId/:password/update/password')
  @ApiOperation({ summary: 'Update the password of a user' })
  async updatePassword(
    @Param('callerId', ParseIntPipe) callerId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
    @Param('password') newPassword: string,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<User> {
    return await this.userService.updateUserPassword(
      loggedUser,
      callerId,
      targetId,
      newPassword,
    );
  }

  @Put(':id/update/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarDto })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ): Promise<UserDTO> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return await this.userService.updateAvatar(id, file);
  }

  @Get('authToken/:token')
  @ApiOperation({ summary: 'Get a user by his token' })
  async getUserByToken(@Param('token') token: string): Promise<User> {
    return await this.userService.findOneByToken(token);
  }

  @Put(':callerId/:targetId/:secret/enable/2fa')
  @ApiOperation({ summary: 'Enable 2FA' })
  async enable2Fa(
    @Param('callerId', ParseIntPipe) callerId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
    @Param('secret') secret: string,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<User> {
    return await this.userService.enable2Fa(
      loggedUser,
      callerId,
      targetId,
      secret,
    );
  }

    @Patch(':callerId/:targetId/:status')
    @ApiOperation({ summary: 'Update the status of a user' })
    async updateStatus(
      @Param('callerId', ParseIntPipe) callerId: number,
      @Param('targetId', ParseIntPipe) targetId: number,
      @Param('status') status: string,
      @Body() loggedUser: UserAuthDTO,
    ): Promise<UserDTO> {
      return await this.userService.updateStatus(
        loggedUser,
        callerId,
        targetId,
        status,
      );
    }

}
