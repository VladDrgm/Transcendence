import { IsNotEmpty, IsNumber } from 'class-validator';
import '../../models/orm_models/friend.entity'
import '../../models/orm_models/user.entity'
import { ApiProperty } from '@nestjs/swagger';

export class FriendDto {

	@ApiProperty({ example: 1, description: 'The ID of the user' })
	@IsNumber()
	@IsNotEmpty()
	UserId: number;

	@ApiProperty({ example: 2, description: 'The ID of the friend' })
	@IsNumber()
	@IsNotEmpty()
	FriendId: number;
}