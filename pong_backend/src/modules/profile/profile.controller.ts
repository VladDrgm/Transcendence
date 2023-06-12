import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Session,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { SharedSession } from '../session/shared-session.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private sharedSession: SharedSession,
  ) {}
  @Get('')
  getPrivateProfile(@Session() session: Record<string, any>) {
    const myID = this.sharedSession.getMyID(session);
    if (isNaN(myID))
      throw new HttpException('Not loged in', HttpStatus.UNAUTHORIZED);
    return this.profileService.getPrivateProfile(myID);
  }
  @Get('friend/:id')
  async getFriendProfile(
    @Param('id', ParseIntPipe) userID: number,
    @Session() session: Record<string, any>,
  ) {
    const myID = this.sharedSession.getMyID(session);
    if (isNaN(myID))
      throw new HttpException('Not loged in', HttpStatus.UNAUTHORIZED);
    const ret = await this.profileService.getFriendProfileByID(userID, myID);
    if (ret === -1)
      throw new HttpException('Not a friend', HttpStatus.UNAUTHORIZED);
    else if (ret === -2)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    else return ret;
  }
  @Get('public/:id')
  getPublicProfile(): string {
    return 'This is your friends profile. But cookies are not implemented yet';
  }

  @Get('myID')
  getMyID(@Session() session: Record<string, any>): string {
    return 'This session ID is: ' + this.sharedSession.getMyID(session);
  }
}
