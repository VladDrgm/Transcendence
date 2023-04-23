export class User {
  userId: number;
  nickname: string;
  avatar: string;
  wins: number;
  losses: number;
  ladderLevel: number;
  status: string;
  achievements: string;
  passwordHash: string;
}

export class Friend {
  fId: number;
  friendId: number;
  userId: number;
  status: string;
}

export class BlockedUser {
  bUserId: number;
  blockedUserId: number;
  userId: number;
}

export class MatchHistory {
  matchHistoryId: number;
  matchId: number;
  userId: number;
}

export class Match {
  matchId: number;
  userId: number;
  opponentId: number;
  player1Points: number;
  player2Points: number;
  gameType: string;
  finalResultString: string;
  date: Date;
}

export class Channel {
  channelId: number;
  ownerId: number;
  name: string;
  type: string;
  password: string;
}

export class ChannelUser {
  cUserId: number;
  userId: number;
  channelId: number;
}

export class ChannelAdmin {
  channelAdminId: number;
  userId: number;
  channelId: number;
}

export class ChannelBlockedUser {
  blockedUserId: number;
  userId: number;
  channelId: number;
}
