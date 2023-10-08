import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyTotpDTO } from './dto/verify-totp.dto'
import { VerifyTotpResponseDTO } from './dto/verify-totp-response.dto'
import { GenerateTotpDTO } from './dto/generate-totp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
}