import {
  Controller,
  Get,
  Param,
  Request,
  Session,
  ParseIntPipe,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  getUser(): string {
    return 'This is public prdile of a user ';
  }

  @Get('login/:id')
  async loginUser(
    @Param('id', ParseIntPipe) userID: number,
    @Session() session: Record<string, any>,
  ) {
    session.userID = userID;
    console.log(userID);
    return 'Loged in with id: ' + userID;
  }
}
