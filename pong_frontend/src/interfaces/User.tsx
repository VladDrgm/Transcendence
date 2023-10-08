
import { Channel } from './Channel';

export interface User {
	username: string,
	intraUsername: string,
	userID: number,
	socketId: string,
	avatarPath: string | undefined,
	wins: number,
	losses: number,
	points: number,
	status: string,
	achievementsCSV: string,
	passwordHash: string,
	friends: User[],
	befriendedBy: User[],
	blocked: User[],
	blockedBy: User[],
	adminChannels: Channel[],
	blockedChannels: Channel[],
	channels: Channel[],
	is2FAEnabled: boolean,
	token: string,
	tfa_secret: string,
}

export interface Invitation {
	sessionId: 		null | string,
	playerOneSocket: null | string,
	playerTwoSocket: null | string,
}