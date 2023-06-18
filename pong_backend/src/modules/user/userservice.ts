import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/models/orm_models/friend.entity';
import { User } from 'src/models/orm_models/user.entity';
import { Repository } from 'typeorm';

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
    .leftJoinAndSelect('user.friends', 'friends')
    .where('user.userID = :id', { id })
    .getOne();
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

}