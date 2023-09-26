import { Controller, Get, Query, Res, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
import { User } from 'src/models/orm_models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('redirect')
export class RedirectController {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		// private readonly passwordService: PasswordService,
		// private readonly authProtector: AuthProtector,
	  ) {}
  	@Get()
  	async handleCallback(
    	@Query('code') code: string,
    	@Res() res: Response,
  	): Promise<void> {
		if (!code) {
      		throw new NotFoundException('Authorization code not provided.');
    	}

    	try {
			//   const clientId = 'u-s4t2ud-73a326211ee639e90086ae51357b3329c87424371ddde5beeb7ec62c91c29f4e';
			// const clientId = `u-s4t2ud-5cd9e549c33e07468ded3a2cc3572e1a4c100c9c139d9c69edee2d7a856d2075`;
			const clientId = process.env.AUTH_UID;

			//   const clientSecret = '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';
			// const clientSecret = `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`;
			const clientSecret = process.env.AUTH_SECRET;

			//   const redirectUri = 'http://localhost:3000/redirect'; // Must match the redirect URI registered with 42 API
			const redirectUri = process.env.REDIRECT_URI; // Must match the redirect URI registered with 42 API
			// const redirectUri = `https://transcendence-server.azurewebsites.net/redirect`;

			// Exchange the authorization code for an access token
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

			const accessToken = response.data.access_token;

			// Use the access token to fetch user information
			const userEndpoint = 'https://api.intra.42.fr/v2/me';
			const userResponse = await axios.get(userEndpoint, {
				headers: {
				Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!userResponse.data) {
				throw new Error('Failed to fetch user information.');
			}

			const userData = userResponse.data;
			const intraName = userData.login;

			
			// New login flow
			var completeProfileURL = ``;
			const isUserInDb = await this.userRepository.findOneBy({
				intraUsername: intraName,
			});
			if (!isUserInDb) {
				completeProfileURL = `${process.env.REDIRECT_PROFILE_URI}?intraName=${intraName}`;
			} else {
				var generatedNumber = Math.floor(1000 + Math.random() * 9000);
				var token = "" + generatedNumber;
				isUserInDb.token = token;
				await this.userRepository.save(isUserInDb);
				completeProfileURL = `${process.env.FRONTEND_URL}/auth_redirect?token=${token}`;
			}

			//TIM'S CODE
			//   const completeProfileURL = `http://localhost:3001/complete_profile?intraName=${intraName}`;
			// const completeProfileURL = `${process.env.REDIRECT_PROFILE_URI}?intraName=${intraName}`;
			//   const completeProfileURL = `http://localhost:3000/complete_profile?intraName=$` + intraName;
			// const completeProfileURL = `https://transcendence-one.vercel.app/complete_profile?intraName=$` + intraName;

			// const completeProfileURL = `${process.env.REDIRECT_PROFILE_URI}?token=${token}`;

			res.redirect(completeProfileURL);
		} catch (error) {
      		console.error('Error during 42 API callback:', error);
    	}
  	}
}
