import { Controller, Get } from '@nestjs/common';

// make sure you have npm installed;
// use "sudo npm install -g @nestjs/cli" to install nestjs globally
// be sure to be insite the root folder of our backend app
// then write nest g controller <controller name> 
// and you will have a controller in 'src', under a directory named <controller name>

@Controller('hello')
export class HelloController {
	@Get()
	getHello(): string {
		return 'Hello, 42 World of Transcendence';
	}
}
