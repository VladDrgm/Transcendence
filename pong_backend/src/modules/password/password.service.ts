import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
	async hashPassword(password: string): Promise<string> {
		const hashedPassword = await bcrypt.hash(password, 10);
		return hashedPassword;
	}

	async comparePassword(hashedPassword: string, password: string): Promise<boolean> {
		if (hashedPassword == await bcrypt.hash(password, 10))
		{
			return (true);
		}
		else
		{
			return (false);
		}
	}
}