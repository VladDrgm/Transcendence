import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './models/mock_data/local_models';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/users')
  async getUsers(): Promise<User[]> {
    return await this.appService.getUsers();
  }
}
