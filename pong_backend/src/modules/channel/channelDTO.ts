import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {

  @ApiProperty({ example: 1, description: 'The owner ID of the channel' })
  @IsNumber()
  @IsNotEmpty()
  OwnerId: number;

  @ApiProperty({ example: 'Channel name', description: 'The name of the channel' })
  @IsString()
  @IsNotEmpty()
  Name: string;

  @ApiProperty({ example: 'Channel type', description: 'The type of the channel' })
  @IsString()
  @IsNotEmpty()
  Type: string;

  @ApiProperty({ example: 'Channel password', description: 'The password of the channel' })
  @IsString()
  @IsNotEmpty()
  Password: string;
}
