import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/models/orm_models/channel.entity';
import { ChannelAdmin } from 'src/models/orm_models/channel_admin.entity';
import { Repository } from 'typeorm';
import { ChannelUser } from 'src/models/orm_models/channel_user.entity';
import { ChannelBlockedUser } from 'src/models/orm_models/channel_blocked_user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateChannelDto } from './channelDTO';
import { plainToClass } from 'class-transformer';



export class ChannelRepository extends Repository<Channel> {}

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
	@InjectRepository(ChannelAdmin)
	private readonly channelAdminRepository: Repository<ChannelAdmin>,
	@InjectRepository(ChannelUser)
	private readonly channelUserRepository: Repository<ChannelUser>,
	@InjectRepository(ChannelBlockedUser)
	private readonly channelBlockedUserRepository: Repository<ChannelBlockedUser>,
  ) {}

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  async GetChannelOwner(channelId: number) : Promise<number>
  {
	  const channel = await this.findOne(channelId);
	  return channel.OwnerId;
  }

  async findOne(id: number): Promise<Channel> {
    return this.channelRepository.findOneBy({ ChannelId: id });
  }

  async create(channelDTO: CreateChannelDto): Promise<Channel> {
	const { Name, OwnerId, Password, Type } = channelDTO;

	const channelDb = new Channel();
	channelDb.Name = Name;
	channelDb.OwnerId = OwnerId;
	channelDb.Password = Password;
	channelDb.Type = Type;

	this.channelAdminRepository.save({ UserId: channelDTO.OwnerId, ChannelId: channelDb.ChannelId });

	return this.channelRepository.save(channelDb);
  }

  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }

  async addAdmin(userId: number, targetId: number, channelId: number): Promise<ChannelAdmin> {
	if (userId === targetId) {
	  throw new HttpException('Cannot add yourself as admin.', 400);
	}

	if (await this.getChannelAdminByUserId(targetId, channelId)) {
		throw new HttpException('User is already admin.', HttpStatus.BAD_REQUEST);
	}

	const channel = await this.findOne(channelId);

	if (!channel) {
		throw new HttpException('Channel not found', 400);
	}

	if ( channel.OwnerId == userId ) {
		const channelAdmin = new ChannelAdmin();
		channelAdmin.UserId = targetId;
		channelAdmin.ChannelId = channelId;
		return this.channelAdminRepository.save(channelAdmin);
	}
	else {
		throw new HttpException('Only channel owner can add admins', 400);
	}
  }

  async getChannelAdmins(channelId: number): Promise<ChannelAdmin[]> {
	return this.channelAdminRepository.findBy({ ChannelId: channelId });
  }

  async getChannelAdminByUserId(userId: number, channelId: number): Promise<ChannelAdmin> {
	return this.channelAdminRepository.findOneBy({ UserId: userId, ChannelId: channelId });
  }

  //this needs refactoring; we need the callerId, the targetId and the channelId;
  //we need to check if the caller is an admin, if the target is already a user, if the target is an admin, if the caller is the owner
  async addChannelUser(userId: number, channelId: number): Promise<ChannelUser> {

	const channel = await this.findOne(channelId);
	if (!channel) {
		throw new HttpException('Channel not found', 400);
	}

	const channel_user = await this.getChannelUserByUserId(userId, channelId);
	if (channel_user) {
		throw new HttpException('User is already in channel.', HttpStatus.BAD_REQUEST);
	}

	const isAdmin = await this.getChannelAdminByUserId(userId, channelId) ? true : false;

	if (!isAdmin) {
		throw new HttpException('You do not have the credentials to add a user.', HttpStatus.BAD_REQUEST);
	}

	const channelUser = new ChannelUser();
	channelUser.UserId = userId;
	channelUser.ChannelId = channelId;
	return this.channelUserRepository.save(channelUser);
  }

  async getChannelUsers(channelId: number): Promise<ChannelUser[]> {
	return this.channelUserRepository.findBy({ ChannelId: channelId });
  }

  async getChannelUserByUserId(userId: number, channelId: number): Promise<ChannelUser> {
	return this.channelUserRepository.findOneBy({ UserId: userId, ChannelId: channelId });
  }

  //this needs refactoring; we need the callerId, the targetId and the channelId;
  //we need to check if the caller is an admin, if the target is already a user, if the target is an admin, if the caller is the owner
  async removeChannelUser(userId: number, channelId: number): Promise<void> {
	const channelUser = await this.getChannelUserByUserId(userId, channelId);
	await this.channelUserRepository.delete(channelUser.CUserId);
  }


  async removeChannelAdmin(userId: number, targetId: number, channelId: number): Promise<string> {

	const CallerAdmin = await this.getChannelAdminByUserId(userId, channelId);
	const isCallerAdmin = CallerAdmin ? true : false;
	if (!isCallerAdmin) {
		throw new HttpException('You do not have the credentials to remove and admin.', HttpStatus.BAD_REQUEST);
	}

	const TargetAdmin = await this.getChannelAdminByUserId(targetId, channelId);
	const isTargetAdmin = TargetAdmin ? true : false;
	const ownerId = await this.GetChannelOwner(channelId);

	if (TargetAdmin == null) {
		throw new HttpException('The target is not an admin.', HttpStatus.BAD_REQUEST);
	}

	if (isCallerAdmin && isTargetAdmin && (CallerAdmin.UserId != ownerId)) {
		throw new HttpException('Only the owner can remove an administrator.', HttpStatus.BAD_REQUEST);
	}

	if (CallerAdmin.UserId == ownerId) {
		if (targetId == ownerId) {
			throw new HttpException('You are the Owner. You cannot remove yourself as Admin.', HttpStatus.BAD_REQUEST);
		}
		await this.channelAdminRepository.delete(TargetAdmin.ChannelAdminId);
		return `Admin has been deleted successfully.`;
	}
  }

  async addChannelBlockedUser(userId: number, channelId: number): Promise<ChannelBlockedUser> {
	const channelBlockedUser = new ChannelBlockedUser();
	channelBlockedUser.UserId = userId;
	channelBlockedUser.ChannelId = channelId;
	return this.channelBlockedUserRepository.save(channelBlockedUser);
  }

  async getChannelBlockedUsers(channelId: number): Promise<ChannelBlockedUser[]> {
	return this.channelBlockedUserRepository.findBy({ ChannelId: channelId });
  }

  async getChannelBlockedUserByUserId(userId: number, channelId: number): Promise<ChannelBlockedUser> {
	return this.channelBlockedUserRepository.findOneBy({ UserId: userId, ChannelId: channelId });
  }

  async removeChannelBlockedUser(userId: number, channelId: number): Promise<void> {
	const channelBlockedUser = await this.getChannelBlockedUserByUserId(userId, channelId);
	await this.channelBlockedUserRepository.delete(channelBlockedUser.BlockedUserId);
  }
}
