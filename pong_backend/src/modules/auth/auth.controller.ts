// import { Controller, Post, Body, Req, Res } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './local-auth.guard';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @UseGuards(LocalAuthGuard)
//   @Post('login')
//   async login(@Req() req: Request, @Res() res: Response) {
//     const token = await this.authService.generateToken(req.user);
//     res.cookie('token', token, { httpOnly: true }); // Set the token as an httpOnly cookie
//     res.send({ message: 'Login successful' });
//   }
// }
