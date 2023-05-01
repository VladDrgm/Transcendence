import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get()
    getUser(): string {
        return "This is public prdile of a user ";
    }
}
