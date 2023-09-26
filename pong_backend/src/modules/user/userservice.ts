import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/orm_models/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './userDTO';
import { PasswordService } from '../password/password.service';
import { FileService } from '../fileservice/file.service';
import { AuthProtector, UserAuthDTO } from '../authProtectorService/authProtector';
import * as speakeasy from 'speakeasy';
import * as uuid from 'uuid';
import * as qrcode from 'qrcode';
import { authenticator } from 'otplib';
import { find } from 'rxjs';

@Injectable()
export class UserService {
  findOneBy: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly fileService: FileService,
    private readonly authProtector: AuthProtector,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.userID = :id', { id })
      .getOne();
  }

  async findOneByToken(token: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.token = :token', { token })
      .getOne();
  }

  async create(user: User): Promise<User> {
    const isUserInDb = await this.userRepository.findOneBy({
      intraUsername: user.intraUsername,
    });
    if (isUserInDb) {
      if (parseInt(process.env.FEATURE_FLAG) === 1) {
        const newHash = await this.passwordService.hashPassword(
          Date.now().toString(),
        );
        await this.userRepository.update(isUserInDb.userID, {
          passwordHash: newHash,
        });
        const result = await this.findOne(isUserInDb.userID);
        return result;
      }
    }

    user.username = user.username.toLowerCase();
	user.intraUsername = user.intraUsername.toLowerCase();
	user.is2FAEnabled = user.is2FAEnabled;
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      user.passwordHash = await this.passwordService.hashPassword(
        Date.now().toString(),
      );
    }
    return await this.userRepository.save(user);
  }

  async generateTOTP() {
	const secret = authenticator.generateSecret();
    const otpauth_url = authenticator.keyuri('user', 'HorrorPong', secret);
    const dataURL = await qrcode.toDataURL(otpauth_url);
	return {
		secret,
		dataURL,
		otpauth_url
	};
  }

  verifyTOTP(secret: string, token: string) {
	return authenticator.verify({ token, secret });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updatePoints(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    points: number,
  ): Promise<void> {
    if (callerId !== targetId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    await this.userRepository.update(targetId, { points: points });
  }

  async updateUsername(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    newUsername: string,
  ): Promise<User> {
    const isUsernameInDb = await this.userRepository.findOneBy({
      username: newUsername,
    });
    const isIntraUsernameInDb = await this.userRepository.findOneBy({
      intraUsername: newUsername,
    });

    if (isUsernameInDb || isIntraUsernameInDb) {
      throw new HttpException(
        'Username already exists. Please choose a different username.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (callerId !== targetId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    await this.userRepository.update(targetId, { username: newUsername });

    return await this.userRepository.findOneBy({ userID: targetId });
  }

  async getUsersOrderedByPoints(): Promise<User[]> {
    return this.userRepository.find({
      order: {
        points: 'DESC',
      },
      take: 10,
    });
  }

  //   async postUserLoggedIn(userDto: UserDTO): Promise<User> {
  // const user = new User();
  // user.username = userDto.username;
  // user.passwordHash = await this.passwordService.hashPassword(
  //   userDto.password,
  // );
  // user.avatarPath = userDto.avatarPath;
  // user.points = userDto.points;
  // user.status = userDto.status;
  // user.achievementsCSV = userDto.achievementsCSV;
  // user.intraUsername = userDto.intraUsername;
  // return this.userRepository.save(user);
  //   }

  async confirmUserLoggedIn(
    ftUserName: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({
      intraUsername: ftUserName,
    });
    if (this.passwordService.comparePassword(user.passwordHash, password)) {
      return user;
    }
    throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
  }

  async updateUserPassword(
    loggedUser,
    callerId,
    targetId,
    newPassword,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ userID: callerId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (callerId !== targetId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const psswd = await this.passwordService.hashPassword(newPassword);
    await this.userRepository.update(targetId, { passwordHash: psswd });

    return await this.userRepository.findOneBy({ userID: targetId });
  }

  async updateAvatar(
    id: number,
    file: Express.Multer.File,
  ): Promise<UserDTO> {

    const userToUpdate = await this.userRepository.findOneBy({ userID: id });

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    let picturePath = '';
    if (file) {
      await this.fileService.deleteImage(userToUpdate.avatarPath);
      picturePath = await this.fileService.saveAvatar(file, id);
    }
    userToUpdate.avatarPath = picturePath;
    return await this.userRepository.save(userToUpdate);
  }

  async getAvatarPath(id: number): Promise<string | null> {
    const user = await this.findOneBy({ userID: id });
    return user ? user.avatarPath : null;
  }
}
