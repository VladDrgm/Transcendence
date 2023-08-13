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

@Injectable()
export class UserService {
  findOneBy: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly fileService: FileService,
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

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updatePoints(id: number, points: number): Promise<void> {
    await this.userRepository.update(id, { points: points });
  }

  async updateUsername(id: number, newUsername: string): Promise<User> {
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

    await this.userRepository.update(id, { username: newUsername });

    return await this.userRepository.findOneBy({ userID: id });
  }

  async getUsersOrderedByPoints(): Promise<User[]> {
    return this.userRepository.find({
      order: {
        points: 'DESC',
      },
      take: 10,
    });
  }

  async postUserLoggedIn(userDto: UserDTO): Promise<User> {
    const user = new User();
    user.username = userDto.username;
    user.passwordHash = await this.passwordService.hashPassword(
      userDto.password,
    );
    user.avatarPath = userDto.avatarPath;
    user.points = userDto.points;
    user.status = userDto.status;
    user.achievementsCSV = userDto.achievementsCSV;
    user.intraUsername = userDto.intraUsername;
    return this.userRepository.save(user);
  }

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

  async updateUserPassword(userId, password): Promise<User> {
    const user = await this.userRepository.findOneBy({ userID: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const psswd = await this.passwordService.hashPassword(password);
    await this.userRepository.update(userId, { passwordHash: psswd });

    return await this.userRepository.findOneBy({ userID: userId });
  }

  async updateAvatar(id: number, file: Express.Multer.File): Promise<void> {
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
    await this.userRepository.save(userToUpdate);
  }

  async getAvatarPath(id: number): Promise<string | null> {
    const user = await this.findOneBy({ userID: id });
    return user ? user.avatarPath : null;
  }
}
