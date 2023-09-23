import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/models/orm_models/user.entity';

export class UserDTO {
  @ApiProperty({ example: 'Username', description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Avatar path',
    description: 'The avatar path of the user',
  })
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

  @ApiProperty({
    example: 'Achievements',
    description: 'The achievements of the user',
  })
  @IsString()
  @IsOptional()
  achievementsCSV: string;

  @ApiProperty({
    example: '42IntraUsername',
    description: 'The 42IntraUsername of the user',
  })
  @IsString()
  @IsOptional()
  intraUsername: string;


  @ApiProperty({
    example: 3,
    description: 'Wins of a user'
  })
    @IsNumber()
    @IsOptional()
    wins: number;

    @ApiProperty({
        example: 3,
        description: 'Losses of a user'
    })
    @IsNumber()
    @IsOptional()
    losses: number;

    @ApiProperty({
        example: 3,
        description: 'The ID of the User'
    })
    @IsNumber()
    @IsNotEmpty()
    userID: number;

    static fromEntity(user: User): UserDTO {
        const userDTO = new UserDTO();
        userDTO.username = user.username;
        userDTO.avatarPath = user.avatarPath;
        userDTO.points = user.points;
        userDTO.status = user.status;
        userDTO.achievementsCSV = user.achievementsCSV;
        userDTO.intraUsername = user.intraUsername;
        userDTO.wins = user.wins;
        userDTO.losses = user.losses;
        userDTO.userID = user.userID;
        return userDTO;
  }
}

export class UserListDto {
    @ApiProperty({ example: 'Username', description: 'The username of the user' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: '3', description: 'The ID of the User'})
    @IsNumber()
    @IsNotEmpty()
    id: number;


    static fromEntity(user: User): UserListDto {
        const userListDto = new UserListDto();
        userListDto.username = user.username;
        userListDto.id = user.userID;
        return userListDto;
    }
}

