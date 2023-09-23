import { Injectable } from '@nestjs/common';
// import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  async generateTOTP() {
// SPEAKEASY 2FA LIBRARY 
    // const secret = speakeasy.generateSecret({name: 'HorrorPong'});
    // // const tempSecret = uuid.v4();
    // const dataURL = await qrcode.toDataURL(secret.otpauth_url);
    // return {
    //   tempSecret: secret.base32,
    //   dataURL,
    //   otpauth_url: secret.otpauth_url
    // };

// OTPLIB 2FA LIBRARY
	// const secret = authenticator.generateSecret();
    // const otpauth_url = authenticator.keyuri('user', 'HorrorPong', secret); // 'user' can be replaced by the user's actual username or email
    // const dataURL = await qrcode.toDataURL(otpauth_url);
	// return {
	// 	secret,
	// 	dataURL,
	// 	otpauth_url
	// };

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
    //   secret: secret,
    //   encoding: 'base32',
    //   token: token,
	//   window: 1,
    // });

// OTPLIB 2FA LIBRARY
	// return authenticator.check(token, secret);
	// return authenticator.verify({ token, secret });

// AUTHENTICATOR 2FA LIBRARY
	// return author.verifyToken(token, secret) !== null;
  }
}