import { Controller, Get, Post } from '@nestjs/common';

// make sure you have npm installed;
// use "sudo npm install -g @nestjs/cli" to install nestjs globally
// be sure to be insite the root folder of our backend app
// then write nest g controller <controller name> 
// and you will have a controller in 'src', under a directory named <controller name>

@Controller('hello')
export class HelloController {
	@Get()
	getHello(): string {
		//create connection to database
		//query database for requessted info which will be indicated as PARAMETERS to our function from the web
		// return the result of the query instead of the hello world message
		return 'Hello, 42 World of Transcendence';
	}
}
