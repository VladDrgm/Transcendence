import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/orm_models/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './userDTO';

export class UserRepository extends Repository<User> {}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async getUsersOrderedByPoints(): Promise<User[]> {
    return this.userRepository.find({
      order: {
        points: 'DESC',
      },
      take: 10,
    });
  }

  async getUserLoggedIn(user: UserDTO): Promise<User> {
	return this.userRepository
	  .createQueryBuilder('user')
	  .where('user.username = :username', { username: user.username })
	  .andWhere('user.password = :password', { password: user.password })
	  .getOne();
  }

  async postUserLoggedIn(userDto: UserDTO): Promise<User> {
	const user = new User();
	user.username = userDto.username;
	user.passwordHash = userDto.password;
	user.avatarPath = userDto.avatarPath;
	user.points = userDto.points;
	user.status = userDto.status;
	user.achievementsCSV = userDto.achievementsCSV;
	user.intraUsername = userDto.intraUsername;
	return this.userRepository.save(user);
  }

  async confirmUserLoggedIn(ftUserName: string, password: string): Promise<User> {
	const user = await this.userRepository.findOneBy({ intraUsername: ftUserName });
	if (user.passwordHash === password) {
	  return user;
	}
	throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
  }

  async updateUserPassword(userId, password): Promise<void> {
	const user = await this.userRepository.findOneBy({ userID: userId });
	if (!user) {
		throw new HttpException('User not found', HttpStatus.NOT_FOUND)
	}

	await this.userRepository.update(userId, { passwordHash: password });
  }
}
