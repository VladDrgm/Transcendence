import { Injectable } from '@nestjs/common';
// import * as speakeasy from 'speakeasy';
import { authenticator } from 'otplib';
import * as uuid from 'uuid';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  async generateTOTP() {
    // const secret = speakeasy.generateSecret({ length: 10, name: 'YourAppName' });
    // const tempSecret = uuid.v4();
    // const dataURL = await qrcode.toDataURL(secret.otpauth_url);
    // return {
    //   tempSecret,
    //   dataURL,
    //   otpauth_url: secret.otpauth_url
    // };
	const secret = authenticator.generateSecret();
    const otpauth_url = authenticator.keyuri('user', 'HorrorPong', secret); // 'user' can be replaced by the user's actual username or email
    const dataURL = await qrcode.toDataURL(otpauth_url);
	return {
		secret,
		dataURL,
		otpauth_url
	  };
  }

  async verifyTOTP(secret: string, token: string) {
    // return await speakeasy.totp.verify({
    //   secret: tempSecret,
    //   encoding: 'base32',
    //   token: token
    // });
	return authenticator.verify({ token, secret });
  }
}