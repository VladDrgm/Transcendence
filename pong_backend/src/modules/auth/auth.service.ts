import { Injectable } from '@nestjs/common';
// import * as speakeasy from 'speakeasy';
import { authenticator } from 'otplib';
// import * as author from 'authenticator';
import * as uuid from 'uuid';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  async generateTOTP() {
// SPEAKEASY 2FA LIBRARY
    // const secret = speakeasy.generateSecret({ length: 10, name: 'YourAppName' });
    // const tempSecret = uuid.v4();
    // const dataURL = await qrcode.toDataURL(secret.otpauth_url);
    // return {
    //   tempSecret,
    //   dataURL,
    //   otpauth_url: secret.otpauth_url
    // };

// OTPLIB 2FA LIBRARY
	const secret = authenticator.generateSecret();
    const otpauth_url = authenticator.keyuri('user', 'HorrorPong', secret); // 'user' can be replaced by the user's actual username or email
    const dataURL = await qrcode.toDataURL(otpauth_url);
	return {
		secret,
		dataURL,
		otpauth_url
	};

// AUTHENTICATOR 2FA LIBRARY
	// const secret = author.generateKey();
    // const otpauth_url = author.generateTotpUri(secret, 'HorrorPong', 'HorrorPong', 'SHA1', 6, 30);
    // const dataURL = await qrcode.toDataURL(otpauth_url);
    // return {
    //   secret,
    //   dataURL,
    //   otpauth_url
    // };
  }

  async verifyTOTP(secret: string, token: string) {
// SPEAKEASY 2FA LIBRARY
    // return await speakeasy.totp.verify({
    //   secret: tempSecret,
    //   encoding: 'base32',
    //   token: token
    // });

// OTPLIB 2FA LIBRARY
	return authenticator.check(token, secret);
	// return authenticator.verify({ token, secret });

// AUTHENTICATOR 2FA LIBRARY
	// return author.verifyToken(token, secret) !== null;
  }
}