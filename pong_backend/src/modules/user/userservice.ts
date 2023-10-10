import {
  BadRequestException,
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
import {
  AuthProtector,
  UserAuthDTO,
} from '../authProtectorService/authProtector';
import * as qrcode from 'qrcode';
import { authenticator } from 'otplib';

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
    const result = await this.userRepository
      .createQueryBuilder('user')
      .where('user.token = :token', { token })
      .getOne();

    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newHash = await this.passwordService.hashPassword(
      Date.now().toString(),
    );

    result.passwordHash = newHash;
    await this.userRepository.save(result);

    return result;
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
    const otpauth_url = authenticator.keyuri('user', 'AmongUsPong', secret);
    const dataURL = await qrcode.toDataURL(otpauth_url);
    return {
      secret,
      dataURL,
      otpauth_url,
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

  async updateAvatar(id: number, file: Express.Multer.File): Promise<UserDTO> {
    const userToUpdate = await this.userRepository.findOneBy({ userID: id });

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    let picturePath = '';
    if (file) {
      await this.fileService.deleteImage(userToUpdate.avatarPath);
      picturePath = await this.fileService.saveAvatar(file, id);
      const parts = picturePath.split('/avatars/');
      if (parts.length > 1) {
        picturePath = './avatars/' + parts[1];
        console.log('avatar path is: ' + picturePath);
      }
    }
    userToUpdate.avatarPath = picturePath;
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return await this.userRepository.save(userToUpdate);
  }

  async getAvatarPath(id: number): Promise<string | null> {
    const user = await this.findOneBy({ userID: id });
    return user ? user.avatarPath : null;
  }

  async enable2Fa(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    secret: string,
	isEnabled: boolean,
  ): Promise<User> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    if (callerId != targetId) {
      throw new HttpException(
        'You cannot set the 2FA for someone else.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userRepository.findOneBy({ userID: callerId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

	if (isEnabled) {
    	user.TFASecret = secret;
	} else {
		user.TFASecret = null;
	}
    user.is2FAEnabled = isEnabled;
    await this.userRepository.save(user);

    return user;
  }

  async updateStatus(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    userStatus: string,
  ): Promise<UserDTO> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    if (callerId !== targetId) {
      throw new HttpException(
        'Caller must be target.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userToUpdate = await this.userRepository.findOneBy({
      userID: callerId,
    });
    if (!userToUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.userRepository.update(targetId, { status: userStatus });

    return await this.userRepository.findOneBy({ userID: targetId });
  }

  async check2Fa(loggedUser, callerId, targetId): Promise<boolean> {

    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    if (callerId !== targetId) {
      throw new HttpException(
        'Caller must be target.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userRepository.findOneBy({ userID: callerId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.is2FAEnabled;
  }
}
