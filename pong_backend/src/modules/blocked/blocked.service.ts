import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blocked } from 'src/models/orm_models/blocked.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/models/orm_models/user.entity';
import { UserService } from '../user/userservice';
import { CreateBlockedDto } from './blockedDTO';

export class BlockedRepository extends Repository<Blocked> {}

@Injectable()
export class BlockedService {
	  constructor(
	@InjectRepository(Blocked)
	private readonly blockedRepository: Repository<Blocked>,
	private readonly userService: UserService,
  ) {}

  async findAllBlockedForOneUser(id: number): Promise<Blocked[]> {
	const result = await this.blockedRepository
	  .createQueryBuilder('blocked')
	  .leftJoinAndSelect('blocked.user', 'user')
	  .leftJoinAndSelect('blocked.blockedUser', 'blockedUser')
	  .where('blocked.user.userID = :id', { id })
	  .getMany();

	return result;

  }

  async blockUser(blockedDTO: CreateBlockedDto): Promise<Blocked> {
	
	const { userId, blockId } = blockedDTO;

	if (userId == blockId) {
		throw new HttpException('Cannot block yourself', 400);
	}

	if (!blockedDTO) {
		throw new HttpException('No data provided', 400);
	}

	if (!userId) {
		throw new HttpException('No user id provided', 400)
	}

	if (!blockId) {
		throw new HttpException('No block id provided', 400);
	}

	const blocked = new Blocked();
	blocked.user = await this.userService.findOne(userId);
	blocked.blockedUser = await this.userService.findOne(blockId);

	return this.blockedRepository.save(blocked);
  }


  async unblockUser(blockedDTO: CreateBlockedDto): Promise<string> {
	if (!blockedDTO) {
		throw new HttpException('No data provided', 400);
	}

	if (!blockedDTO.userId) {
		throw new HttpException('No user id provided', 400);
	}

	if (!blockedDTO.blockId) {
		throw new HttpException('No block id provided', 400);
	}

	const { userId, blockId } = blockedDTO;

	const blocked = await this.blockedRepository
		.createQueryBuilder('blocked')
		.leftJoinAndSelect('blocked.user', 'user')
		.leftJoinAndSelect('blocked.blockedUser', 'blockedUser')
		.where('blocked.user.userID = :userId', { userId })
		.andWhere('blocked.blockedUser.userID = :blockId', { blockId })
		.getOne();

	if (!blocked) {
		throw new HttpException('No such blocked user', 400);
	}

	await this.blockedRepository.delete(blocked.blockId);
	return 'User unblocked';
  }

  async getOneBlockedUser(userId, blockId): Promise<Blocked> {

	if (!userId) {
		throw new HttpException('No user id provided', 400);
	}

	if (!blockId) {
		throw new HttpException('No block id provided', 400);
	}

	const result =  await this.blockedRepository
		.createQueryBuilder('blocked')
		.leftJoinAndSelect('blocked.user', 'user')
		.leftJoinAndSelect('blocked.blockedUser', 'blockedUser')
		.where('blocked.user.userID = :userId', { userId })
		.andWhere('blocked.blockedUser.userID = :blockId', { blockId })
		.getOne();

	if (!result) {
		throw new HttpException('No such blocked user', 200);
	}

	return result;
  }
}