import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/models/orm_models/channel.entity';
import { ChannelAdmin } from 'src/models/orm_models/channel_admin.entity';
import { Repository } from 'typeorm';
import { ChannelUser } from 'src/models/orm_models/channel_user.entity';
import { ChannelBlockedUser } from 'src/models/orm_models/channel_blocked_user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PasswordService } from '../password/password.service';
import {
  AuthProtector,
  UserAuthDTO,
} from '../authProtectorService/authProtector';

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
    private readonly passwordService: PasswordService,
    private readonly authProtector: AuthProtector,
  ) {}

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  async GetChannelOwner(channelId: number): Promise<number> {
    const channel = await this.findOne(channelId);
    return channel.OwnerId;
  }

  async findOne(id: number): Promise<Channel> {
    return await this.channelRepository.findOneBy({ ChannelId: id });
  }

  async create(
    loggedUser,
    callerId,
    ownerId,
    channelName,
    channelType,
    channelPassword,
  ): Promise<Channel> {
    if (ownerId != callerId) {
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

    const channel = await this.channelRepository.findOneBy({
      Name: channelName,
    });
    if (channel) {
      throw new HttpException('Channel name already exists', 400);
    }

    const channelDb = new Channel();

    channelDb.Name = channelName;
    channelDb.OwnerId = callerId;
    if (
      channelPassword != null &&
      channelPassword != '' &&
      channelPassword != undefined
    ) {
      channelDb.Password = await this.passwordService.hashPassword(
        channelPassword,
      );
    }
    channelDb.Type = channelType;

    const ChannelId = await this.channelRepository
      .save(channelDb)
      .then((channel) => channel.ChannelId);

    const adminCreate = new ChannelAdmin();
    adminCreate.UserId = channelDb.OwnerId;
    adminCreate.ChannelId = ChannelId;

    this.channelAdminRepository.save(adminCreate);

    return channelDb;
  }

  async remove(
    loggedUser: UserAuthDTO,
    callerId: number,
    channelId: number,
  ): Promise<void> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const channel = await this.findOne(channelId);
    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    const isOwner = channel.OwnerId == callerId;
    if (!isOwner) {
      throw new HttpException('You are not the owner of this channel', 400);
    }

    await this.channelAdminRepository.delete({ ChannelId: channelId });
    await this.channelUserRepository.delete({ ChannelId: channelId });
    await this.channelBlockedUserRepository.delete({ ChannelId: channelId });
    await this.channelRepository.delete(channelId);
  }

  async addAdmin(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    channelId: number,
  ): Promise<ChannelAdmin> {
    if (callerId === targetId) {
      throw new HttpException('Cannot add yourself as admin.', 400);
    }

    if (await this.getChannelAdminByUserId(targetId, channelId)) {
      throw new HttpException('User is already admin.', HttpStatus.BAD_REQUEST);
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

    const channel = await this.findOne(channelId);

    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    if (channel.OwnerId == callerId) {
      const channelAdmin = new ChannelAdmin();
      channelAdmin.UserId = targetId;
      channelAdmin.ChannelId = channelId;
      return this.channelAdminRepository.save(channelAdmin);
    } else {
      throw new HttpException('Only channel owner can add admins', 400);
    }
  }

  async getChannelAdmins(channelId: number): Promise<ChannelAdmin[]> {
    return this.channelAdminRepository.findBy({ ChannelId: channelId });
  }

  async getChannelAdminByUserId(
    userId: number,
    channelId: number,
  ): Promise<ChannelAdmin> {
    return this.channelAdminRepository.findOneBy({
      UserId: userId,
      ChannelId: channelId,
    });
  }

  async addChannelUser(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    channelId: number,
  ): Promise<ChannelUser> {
    const channel = await this.findOne(channelId);
    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    const channel_user = await this.getChannelUserByUserId(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
    if (channel_user) {
      throw new HttpException(
        'User is already in channel.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isAdmin = (await this.getChannelAdminByUserId(callerId, channelId))
      ? true
      : false;

    if (!isAdmin) {
      throw new HttpException(
        'You do not have the credentials to add a user.',
        HttpStatus.BAD_REQUEST,
      );
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

    const channelUser = new ChannelUser();
    channelUser.UserId = targetId;
    channelUser.ChannelId = channelId;
    return this.channelUserRepository.save(channelUser);
  }

  async getChannelUsers(channelId: number): Promise<ChannelUser[]> {
    const users = await this.channelUserRepository.findBy({
      ChannelId: channelId,
    });

    const currentTimestamp = new Date();
    users.forEach((user) => {
      if (user.MutedUntil && user.MutedUntil <= currentTimestamp) {
        user.MutedUntil = null;
      }
    });

    return this.channelUserRepository.save(users);
  }

  async getChannelUserByUserId(
    loggedUser: UserAuthDTO,
    callerId: number,
    userId: number,
    channelId: number,
  ): Promise<ChannelUser> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const isChannelOwner = (await this.GetChannelOwner(channelId)) == userId;

    const isChannelAdmin = await this.getChannelAdminByUserId(
      callerId,
      channelId,
    );

    if (!isChannelOwner && !isChannelAdmin && callerId != userId) {
      throw new HttpException(
        'You do not have the credentials to get a user.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.channelUserRepository.findOneBy({
      UserId: userId,
      ChannelId: channelId,
    });

    return user;
  }

  async removeChannelUser(
    callerId: number,
    targetId: number,
    channelId: number,
    loggedUser: UserAuthDTO,
  ): Promise<void> {
    const channel = await this.findOne(channelId);
    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }
    const channelUser = await this.getChannelUserByUserId(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
    if (!channelUser) {
      throw new HttpException(
        'User is not part of this channel.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isAdmin = (await this.getChannelAdminByUserId(callerId, channelId))
      ? true
      : false;

    const isOwner = channel.OwnerId == callerId;

    if (!isAdmin && !isOwner && callerId != targetId) {
      throw new HttpException(
        'You do not have the credentials to remove a user.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.channelUserRepository.delete(channelUser.CUserId);
  }

  async removeChannelAdmin(
    loggedUser: UserAuthDTO,
    userId: number,
    targetId: number,
    channelId: number,
  ): Promise<string> {
    const CallerAdmin = await this.getChannelAdminByUserId(userId, channelId);
    const isCallerAdmin = CallerAdmin ? true : false;
    if (!isCallerAdmin) {
      throw new HttpException(
        'You do not have the credentials to remove an admin.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        userId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const TargetAdmin = await this.getChannelAdminByUserId(targetId, channelId);
    const isTargetAdmin = TargetAdmin ? true : false;
    const ownerId = await this.GetChannelOwner(channelId);

    if (TargetAdmin == null) {
      throw new HttpException(
        'The target is not an admin.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isCallerAdmin && isTargetAdmin && CallerAdmin.UserId != ownerId) {
      throw new HttpException(
        'Only the owner can remove an administrator.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (CallerAdmin.UserId == ownerId) {
      if (targetId == ownerId) {
        throw new HttpException(
          'You are the Owner. You cannot remove yourself as Admin.',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.channelAdminRepository.delete(TargetAdmin.ChannelAdminId);
      return `Admin has been deleted successfully.`;
    }
  }

  async addChannelBlockedUserService(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    channelId: number,
  ): Promise<ChannelBlockedUser> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    if (callerId == targetId) {
      throw new HttpException(
        'You cannot ban yourself.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      await this.getChannelBlockedUserByUserId(
        loggedUser,
        callerId,
        targetId,
        channelId,
      )
    ) {
      throw new HttpException(
        'User is already blocked.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const callerIsAdmin = (await this.getChannelAdminByUserId(
      callerId,
      channelId,
    ))
      ? true
      : false;

    if (callerIsAdmin == false) {
      throw new HttpException(
        'You do not have the credentials to ban a user.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const channel = await this.findOne(channelId);

    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    if (channel.OwnerId == targetId) {
      throw new HttpException('You can not ban the Channel Owner', 400);
    }

    const channelBlockedUser = new ChannelBlockedUser();
    channelBlockedUser.UserId = targetId;
    channelBlockedUser.ChannelId = channelId;

    return await this.channelBlockedUserRepository.save(channelBlockedUser);
  }

  async getChannelBlockedUsers(
    channelId: number,
  ): Promise<ChannelBlockedUser[]> {
    return this.channelBlockedUserRepository.findBy({ ChannelId: channelId });
  }

  async getChannelBlockedUserByUserId(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    channelId: number,
  ): Promise<ChannelBlockedUser> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const result = await this.channelBlockedUserRepository.findOneBy({
      UserId: targetId,
      ChannelId: channelId,
    });
    if (result) return result;
    return null;
  }

  async removeChannelBlockedUser(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    channelId: number,
  ): Promise<boolean> {
    try {
      if (parseInt(process.env.FEATURE_FLAG) === 1) {
        const authPass = await this.authProtector.protectorCheck(
          loggedUser.passwordHash,
          callerId,
        );
        if (!authPass) {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
      }

      if (callerId === targetId) {
        throw new HttpException(
          'You cannot unban yourself.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the user is blocked before attempting to remove
      const channelBlockedUser = await this.getChannelBlockedUserByUserId(
        loggedUser,
        callerId,
        targetId,
        channelId,
      );

      const isUserBlocked = channelBlockedUser ? true : false;

      if (!isUserBlocked) {
        throw new HttpException('User is not blocked.', HttpStatus.BAD_REQUEST);
      }

      const callerIsAdmin = await this.getChannelAdminByUserId(
        callerId,
        channelId,
      );

      if (!callerIsAdmin) {
        throw new HttpException(
          'You do not have the credentials to unban a user.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.channelBlockedUserRepository.remove(channelBlockedUser);

      return true;
    } catch (error) {
      console.error('Error removing channelBlockedUser:', error);

      return false;
    }
  }

  async changeChannelType(
    loggedUser: UserAuthDTO,
    callerId: number,
    channelId: number,
  ): Promise<void> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }
    const channel = await this.findOne(channelId);
    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }
    const isOwner = channel.OwnerId == callerId;
    if (!isOwner) {
      throw new HttpException('You are not the owner of this channel', 400);
    }
    channel.Type = channel.Type == 'public' ? 'private' : 'public';

    if (
      (channel.Password === null || channel.Password === '') &&
      channel.Type === 'private'
    ) {
      throw new HttpException('Channel password is empty', 400);
    }

    await this.channelRepository.save(channel);
  }

  async deleteChannelPassword(
    loggedUser: UserAuthDTO,
    callerId: number,
    channelId: number,
  ): Promise<void> {
    const channel = await this.findOne(channelId);
    if (!channel) {
      throw new HttpException('Channel not found', 400);
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
    const isOwner = channel.OwnerId == callerId;
    if (!isOwner) {
      throw new HttpException('You are not the owner of this channel', 400);
    }
    channel.Password = '';
    await this.channelRepository.save(channel);
  }

  async changeChannelPassword(
    loggedUser: UserAuthDTO,
    callerId: number,
    channelId: number,
    password: string,
  ): Promise<void> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }
    const channel = await this.findOne(channelId);
    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }
    const isOwner = channel.OwnerId == callerId;
    if (!isOwner) {
      throw new HttpException('You are not the owner of this channel', 400);
    }
    channel.Password = await this.passwordService.hashPassword(password);
    await this.channelRepository.save(channel);
  }

  async addUserToPrivateChannel(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    channelId: number,
    password: string,
  ): Promise<void> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }
    const channel = await this.findOne(channelId);
    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    if (channel.Type != 'private') {
      throw new HttpException('Channel is not private', 400);
    }

    if (
      (await this.passwordService.comparePassword(
        channel.Password,
        password,
      )) == false
    ) {
      throw new HttpException('Wrong password.', 400);
    }
    const channelUser = await this.getChannelUserByUserId(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
    if (channelUser) {
      throw new HttpException(
        'User is already in channel.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const channelBlockedUser = await this.getChannelBlockedUserByUserId(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
    if (channelBlockedUser) {
      throw new HttpException(
        'User is blocked from channel.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const channelUserCreate = new ChannelUser();
    channelUserCreate.UserId = targetId;
    channelUserCreate.ChannelId = channelId;
    await this.channelUserRepository.save(channelUserCreate);
  }

  async muteUserForDuration(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    channelId: number,
    durationInMinutes: number,
  ): Promise<void> {
    const channel = await this.findOne(channelId);

    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    const channelUser = await this.getChannelUserByUserId(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
    if (!channelUser) {
      throw new HttpException(
        'User is not part of this channel.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.OwnerId == targetId) {
      throw new HttpException('You can not ban the Channel Owner', 400);
    }

    const isAdmin = (await this.getChannelAdminByUserId(callerId, channelId))
      ? true
      : false;

    if (!isAdmin) {
      throw new HttpException(
        'Insufficient permissions to mute users',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentTimestamp = new Date();
    const futureTimestamp = new Date(
      currentTimestamp.getTime() + durationInMinutes * 60000,
    ); // 60000 milliseconds = 1 minute

    channelUser.MutedUntil = futureTimestamp;
    await this.channelUserRepository.save(channelUser);
  }

  async getChannelOwner(channelId: number): Promise<ChannelAdmin> {
    const channel = await this.findOne(channelId);
    const result = await this.channelAdminRepository.findOneBy({
      ChannelId: channelId,
      UserId: channel.OwnerId,
    });

    if (!result) {
      throw new HttpException('Channel owner not found', 400);
    }

    return result;
  }

  async deleteChannelOwner(channelId: number): Promise<void> {
    const channel = await this.findOne(channelId);

    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    await this.channelAdminRepository.delete(channel.OwnerId);
    channel.OwnerId = -1;

    await this.channelRepository.save(channel);
  }

  async changeChannelOwner(userId: number, channelId: number): Promise<void> {
    const channel = await this.findOne(channelId);

    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    channel.OwnerId = userId;
    await this.channelRepository.save(channel);

    const newChannelAdmin = new ChannelAdmin();
    newChannelAdmin.UserId = userId;
    newChannelAdmin.ChannelId = channelId;
    await this.channelAdminRepository.save(newChannelAdmin);
  }

  async getMutedStatus(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
    channelId: number,
  ): Promise<boolean> {
    const channel = await this.findOne(channelId);

    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    const channelUser = await this.getChannelUserByUserId(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
    if (!channelUser) {
      throw new HttpException(
        'User is not part of this channel.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!channelUser.MutedUntil) {
      throw new HttpException('User is not muted.', HttpStatus.BAD_REQUEST);
    }

    const isAdmin = (await this.getChannelAdminByUserId(callerId, channelId))
      ? true
      : false;

    if (!isAdmin) {
      throw new HttpException(
        'Insufficient permissions to get muted users',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = channelUser.MutedUntil > new Date();

    return result;
  }

  async getChannelUsersOnMute(channelId: number): Promise<ChannelUser[]> {
    const users = await this.channelUserRepository.findBy({
      ChannelId: channelId,
    });

    const currentTimestamp = new Date();
    const mutedUsers = users.filter(
      (user) => user.MutedUntil && user.MutedUntil > currentTimestamp,
    );

    return mutedUsers;
  }

  async createPublicChannelUser(
    loggedUser: UserAuthDTO,
    callerId: number,
    channelId: number,
  ): Promise<void> {
    const channel = await this.channelRepository.findOneByOrFail({
      ChannelId: channelId,
      Type: 'public',
    });

    if (!channel) {
      throw new HttpException('Channel not found', 400);
    }

    const channelUser = await this.getChannelUserByUserId(
      loggedUser,
      callerId,
      callerId,
      channelId,
    );
    if (channelUser) {
      throw new HttpException(
        'User is already in channel.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new ChannelUser();
    newUser.UserId = callerId;
    newUser.ChannelId = channelId;

    await this.channelUserRepository.save(newUser);
  }
}
