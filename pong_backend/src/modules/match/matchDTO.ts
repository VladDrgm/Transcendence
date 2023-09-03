import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MatchDTO {

  @ApiProperty({ example: 1, description: 'The ID of the player 1' })
  @IsNumber()
  @IsNotEmpty()
  Player1Id: number;

  @ApiProperty({ example: 2, description: 'The ID of the player 2' })
  @IsNumber()
  @IsNotEmpty()
  Player2Id: number;

  @ApiProperty({ example: 10, description: 'Player 1 points' })
  @IsNumber()
  @IsNotEmpty()
  Player1Points: number;

  @ApiProperty({ example: 8, description: 'Player 2 points' })
  @IsNumber()
  @IsNotEmpty()
  Player2Points: number;

  @ApiProperty({ example: 'Type A', description: 'The game type' })
  @IsString()
  @IsNotEmpty()
  GameType: string;

  @ApiProperty({ example: 'Result A', description: 'The final result' })
  @IsString()
  @IsNotEmpty()
  FinalResultString: string;

  @ApiProperty({
    example: '2023-07-10T10:00:00Z',
    description: 'The start time',
  })
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({ example: '2023-07-10T12:00:00Z', description: 'The end time' })
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({ example: 1, description: 'The ID of the winner' })
  @IsNumber()
  WinnerId: number;

  @ApiProperty({ example: 'Condition A', description: 'The winning condition' })
  @IsString()
  @IsNotEmpty()
  WinningCondition: string;

//   @ApiProperty({ example: "SystemRequest", description: 'Automated system Request' })
//   @IsString()
//   @IsOptional()
//   Requester: string;

//   @ApiProperty({ example: "$#SJDS%$345fDFsdsdg5454", description: 'System request hashed secret' })
//   @IsString()
//   @IsOptional()
//   RequesterSecret: string;
}
