import { Controller, Get, Query, Res, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('redirect')
export class RedirectController {
  @Get()
  async handleCallback(@Query('code') code: string, @Res() res: Response): Promise<void> {
    if (!code) {
      throw new NotFoundException('Authorization code not provided.');
    }

    try {
      const clientId = 'u-s4t2ud-73a326211ee639e90086ae51357b3329c87424371ddde5beeb7ec62c91c29f4e';
      const clientSecret = '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';
      const redirectUri = 'http://localhost:3000/redirect'; // Must match the redirect URI registered with 42 API

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
        }
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

      // Now you have the user's information (userData) and the access token (accessToken)
      // You can proceed to implement user creation/update and authentication logic
      // For demonstration, let's simply redirect to a success page
      res.redirect('http://localhost:3001/complete_profile'); // Replace with your success page URL
    } catch (error) {
      console.error('Error during 42 API callback:', error);
    //   res.redirect('http://localhost:3000/error'); // Replace with your error page URL
    }
  }
}