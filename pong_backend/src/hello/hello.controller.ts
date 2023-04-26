import { Controller, Get } from '@nestjs/common';
import { EntityManager } from 'typeorm';

// make sure you have npm installed;
// use "sudo npm install -g @nestjs/cli" to install nestjs globally
// be sure to be insite the root folder of our backend app
// then write nest g controller <controller name>
// and you will have a controller in 'src', under a directory named <controller name>

@Controller('hello')
export class HelloController {
	constructor(private readonly entityManager: EntityManager) {}


  @Get()
  async getHello(): Promise<string> {
    //use the connection to the database to extract the names of the databases;
	const result =  await this.entityManager.query('SELECT datname FROM pg_database');

	//return the names of the databases
	return result.map(db => db.datname);
  }
}
