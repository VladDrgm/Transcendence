import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service';
import { PublicProfile } from 'src/shared/interfaces/profiles/public_profile.interface';


@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}
    @Get('')
    getPrivateProfile(): string {
        return this.profileService.getPrivateProfile();
    }
    @Get('friend/:id')
    getFriendProfile(
        @Param('id', ParseIntPipe) userID: number)
    {
        const ret = this.profileService.getFriendProfileByID(userID);
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
