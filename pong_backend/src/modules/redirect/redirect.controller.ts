import {
  Controller,
  Get,
  Query,
  Res,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
import { User } from 'src/models/orm_models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthProtector } from '../authProtectorService/authProtector';

@Controller('redirect')
export class RedirectController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authProtector: AuthProtector,
  ) {}

  @Get()
  // @UseGuards(AuthProtector)
  async handleCallback(
    @Query('code') code: string,
    @Query('intraName') intraName: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!code || !intraName) {
      throw new NotFoundException(
        'Authorization code or intraName not provided.',
      );
    }

    try {
      const clientId = process.env.AUTH_UID;
      const clientSecret = process.env.AUTH_SECRET;
      const redirectUri = process.env.REDIRECT_URI;

      const accessToken = await this.exchangeCodeForAccessToken(
        clientId,
        clientSecret,
        code,
        redirectUri,
      );

      const userData = await this.fetchUserData(accessToken);
      const intraName = userData.login;
      // const isAuthenticated = await this.authProtector(
      //   accessToken,
      //   user.userID,
      // );

      // if (!isAuthenticated) {
      //   throw new UnauthorizedException('Authentication failed.');
      // }

      // Authorize user based on intraName
      const isAuthorized = await this.authProtector.protectorCheckAuthorization(
        intraName,
      );

      if (!isAuthorized) {
        throw new UnauthorizedException('Unauthorized access.');
      }

      const completeProfileURL = await this.generateCompleteProfileURL(
        intraName,
        userData,
      );

      res.redirect(completeProfileURL);
    } catch (error) {
      console.error('Error during 42 API callback:', error);
    }
  }

  private async exchangeCodeForAccessToken(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string,
  ): Promise<string> {
    const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';
    const response = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    if (!response.data.access_token) {
      throw new Error('Access token not received.');
    }

    return response.data.access_token;
  }

  private async fetchUserData(accessToken: string): Promise<any> {
    const userEndpoint = 'https://api.intra.42.fr/v2/me';
    const userResponse = await axios.get(userEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.data) {
      throw new Error('Failed to fetch user information.');
    }

    return userResponse.data;
  }

  private async generateCompleteProfileURL(
    intraName: string,
    userData: any,
  ): Promise<string> {
    let completeProfileURL = '';

    const isUserInDb = await this.userRepository.findOneBy({
      intraUsername: intraName,
    });

    if (!isUserInDb && !userData) {
      completeProfileURL = `${process.env.REDIRECT_PROFILE_URI}?intraName=${intraName}`;
    } else {
      const generatedNumber = Math.floor(1000 + Math.random() * 9000);
      const token = '' + generatedNumber;

      if (isUserInDb) {
        isUserInDb.token = token;
        await this.userRepository.save(isUserInDb);
      }

      completeProfileURL = `${process.env.FRONTEND_URL}/auth_redirect?token=${token}`;
    }

    return completeProfileURL;
  }
}
