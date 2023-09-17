import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyTotpDTO } from './dto/verify-totp.dto'
import { VerifyTotpResponseDTO } from './dto/verify-totp-response.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/generate-totp')
  generateTOTP() {
    return this.authService.generateTOTP();
  }

  @Post('/verify-totp')
  async verifyTOTP(@Body() verifyTotpDto: VerifyTotpDTO): Promise<VerifyTotpResponseDTO> {
    const isValid = await this.authService.verifyTOTP(verifyTotpDto.secret, verifyTotpDto.token);
        return { isValid };
  }
}