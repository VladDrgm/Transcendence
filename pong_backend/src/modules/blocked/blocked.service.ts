import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blocked } from 'src/models/orm_models/blocked.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/userservice';
import {
  AuthProtector,
  UserAuthDTO,
} from '../authProtectorService/authProtector';

export class BlockedRepository extends Repository<Blocked> {}

@Injectable()
export class BlockedService {
  constructor(
    @InjectRepository(Blocked)
    private readonly blockedRepository: Repository<Blocked>,
    private readonly userService: UserService,
    private readonly authProtector: AuthProtector,
  ) {}

  async findAllBlockedForOneUser(
    loggedUser: UserAuthDTO,
    callerId: number,
  ): Promise<Blocked[]> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const result = await this.blockedRepository.findBy({ userId: callerId });

    return result;
  }

  async blockUser(loggedUser, callerId, targetId): Promise<Blocked> {
    const userId = callerId;
    const blockId = targetId;

    if (userId == blockId) {
      throw new HttpException('Cannot block yourself', 400);
    }

    if (!userId) {
      throw new HttpException('No user id provided', 400);
    }

    if (!blockId) {
      throw new HttpException('No block id provided', 400);
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

    const existingBlocked = await this.blockedRepository.findOneBy({
        userId: userId,
        blockedUserId: blockId,
        });

    if (existingBlocked) {
      throw new HttpException('User already blocked', 400);
    }

    const blocked = new Blocked();
    blocked.userId = (await this.userService.findOne(userId)).userID;
    blocked.blockedUserId = (await this.userService.findOne(blockId)).userID;

    return this.blockedRepository.save(blocked);
  }

  async unblockUser(loggedUser, callerId, targetId): Promise<string> {
    const userId = callerId;
    const blockId = targetId;

    if (userId == blockId) {
      throw new HttpException('Cannot unblock yourself', 400);
    }

    if (!userId) {
      throw new HttpException('No user id provided', 400);
    }

    if (!blockId) {
      throw new HttpException('No block id provided', 400);
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

    const blocked = await this.blockedRepository.findOneBy({
      userId: userId,
      blockedUserId: blockId,
    });

    if (!blocked) {
      throw new HttpException('No such blocked user', 400);
    }

    await this.blockedRepository.delete(blocked.blockId);
    return 'User unblocked';
  }

  async getOneBlockedUser(loggedUser, callerId, targetId): Promise<string> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const result = await this.blockedRepository.findOneBy({
        userId: callerId,
        blockedUserId: targetId
        });
    
    if (!result) {
            return "User not blocked";
        }

    return "User is blocked";
  }
}
