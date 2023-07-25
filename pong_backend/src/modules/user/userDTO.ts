import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
	  @ApiProperty({ example: 1, description: 'The user ID' })
  @IsNumber()
  @IsNotEmpty()
  userID: number;

  @ApiProperty({ example: 'Username', description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Password', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Avatar path', description: 'The avatar path of the user' })
  @IsString()
  @IsOptional()
  avatarPath: string;

  @ApiProperty({ example: 0, description: 'The points of the user' })
  @IsNumber()
  @IsNotEmpty()
  points: number;

  @ApiProperty({ example: 'offline', description: 'The status of the user' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 'Achievements', description: 'The achievements of the user' })
  @IsString()
  @IsOptional()
  achievementsCSV: string;

  @ApiProperty({ example: '42IntraUsername', description: 'The 42IntraUsername of the user' })
  @IsString()
  @IsOptional()
  intraUsername: string;
}