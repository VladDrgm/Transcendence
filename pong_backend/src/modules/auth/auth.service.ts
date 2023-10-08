import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async generateTOTP() {
  }

  async verifyTOTP(secret: string, token: string) {
  }
}