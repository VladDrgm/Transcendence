import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockedDto {

  @ApiProperty({ example: 1, description: 'The caller' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 2, description: 'The user to be banned' })
  @IsString()
  @IsNotEmpty()
  blockId: number;
}
