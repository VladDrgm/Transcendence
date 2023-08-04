import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Redirect')
@Controller('redirect')
export class RedirectController {
  //   constructor() { }

  @Get()
  getRedirect(): string {
    return 'This is a redirect. But cookies are not implemented yet';
  }
}
