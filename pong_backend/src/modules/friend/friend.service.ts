import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/models/orm_models/friend.entity';
import { Repository } from 'typeorm';

export class FriendRepository extends Repository<Friend> {}

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}

  async findAll(): Promise<Friend[]> {
    return this.friendRepository.find();
  }

  async findOne(id: number): Promise<Friend> {
    return this.friendRepository.findOneBy({ FId: id });
  }

  async remove(id: number): Promise<void> {
    await this.friendRepository.delete(id);
  }
}
