import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service';


@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}
    @Get('')
    getPrivateProfile(): string {
        return this.profileService.getPrivateProfile();
    }
    @Get('friend/:id')
    async getFriendProfile(
        @Param('id', ParseIntPipe) userID: number)
    {
        const ret = await this.profileService.getFriendProfileByID(userID);
        if (ret === -1)
            throw new HttpException('Not a friend', HttpStatus.UNAUTHORIZED);
        else if (ret === -2)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        else
            return ret;

    }
    @Get('public/:id')
    getPublicProfile(): string {
        return "This is your friends profile. But cookies are not implemented yet";
    }


}
