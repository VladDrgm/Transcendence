import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/models/orm_models/user.entity";
import { Repository } from "typeorm";
import { PasswordService } from "../password/password.service";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class AuthProtector {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly passwordService: PasswordService
    ) {}

    async protectorCheck(hash : string, id : number): Promise<boolean> {
        const user = await this.userRepository.findOneBy({userID : id});
        if (!user) { return false; }

        const passwordIsMatching = await this.passwordService.compareToken(hash, user.passwordHash);
        if (passwordIsMatching) { return true; }

        return false;
    }
}

export class UserAuthDTO {
    @ApiProperty({
        example: 'vdragomi',
        description: 'intra username',
      })
      @IsString()
      @IsNotEmpty()
    intraUsername: string;
    @ApiProperty({
        example: '$2b$10$7jvbxST0POK/JtjsqLRkx.fgIQDKXN19HyyXiUM5i8fO1As7ar8.6',
        description: 'PasswordHash',
      })
      @IsString()
      @IsNotEmpty()
    passwordHash: string;
}