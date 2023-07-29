import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/orm_models/user.entity';
import { In, Repository } from 'typeorm';
import { UserDTO } from './userDTO';
import { PasswordService } from '../password/password.service';

export class UserRepository extends Repository<User> {}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
	@InjectRepository(PasswordService)
	private readonly passwordService: PasswordService,
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

  async updateAvatar(id: number, newAvatar: string): Promise<void> {
    await this.userRepository.update(id, { avatarPath: newAvatar });
  }

  async updateUsername(id: number, newUsername: string): Promise<void> {
    const isUsernameInDb = await this.userRepository.findOneBy({
      username: newUsername,
    });

    if (isUsernameInDb) {
      throw new HttpException(
        'Username already exists. Please choose a different username.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.userRepository.update(id, { username: newUsername });
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
    user.passwordHash = await this.passwordService.hashPassword(userDto.password);
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
    if (this.passwordService.comparePassword(user.passwordHash, await this.passwordService.hashPassword(password))) {
      return user;
    }
    throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
  }

  async updateUserPassword(userId, password): Promise<void> {
    const user = await this.userRepository.findOneBy({ userID: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
	const psswd = await this.passwordService.hashPassword(password);
    await this.userRepository.update(userId, { passwordHash: psswd });
  }
}
