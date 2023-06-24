import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/models/orm_models/channel.entity';
import { ChannelAdmin } from 'src/models/orm_models/channel_admin.entity';
import { Repository } from 'typeorm';

export class ChannelRepository extends Repository<Channel> {}

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
	@InjectRepository(ChannelAdmin)
	private readonly channelAdminRepository: Repository<ChannelAdmin>,
  ) {}

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  async findOne(id: number): Promise<Channel> {
    return this.channelRepository.findOneBy({ ChannelId: id });
  }

  async create(channel: Channel): Promise<Channel> {
    return this.channelRepository.save(channel);
  }

  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }

  async addAdmin(userId: number, channelId: number): Promise<ChannelAdmin> {
	const channelAdmin = new ChannelAdmin();
	channelAdmin.UserId = userId;
	channelAdmin.ChannelId = channelId;
	return this.channelAdminRepository.save(channelAdmin);
  }

  async getChannelAdmins(channelId: number): Promise<ChannelAdmin[]> {
	return this.channelAdminRepository.findBy({ ChannelId: channelId });
  }
}
