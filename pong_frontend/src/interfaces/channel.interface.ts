import React, { FC, ChangeEvent, KeyboardEvent } from "react";
import { User } from "./user.interface";

export interface Channel {
	ChannelId: number;
 	OwnerId: number;
  	Name: string;
  	Type: string;
  	Password: string;
}

export interface ChatProps {
	userID: number; //userID from login process
	user: User; //USer from login process
	toggleChat: (currentChat: ChatData) => void;
	yourId: string | number;  //socketId from joining the game
	username: string; //name given in the game startpage
	currentChat: ChatData;
	ChannelUserRoles: ChannelUserRoles;
	handleAdminCheck: () => void;
	addAdminRights: (TargetName: string, chatName: ChatName) => void;
	banUserSocket: (targetId: number, chatName: ChatName) => void;
	unbanUserSocket: (targetId: number, chatName: ChatName) => void;
	connectedRooms: string[];
	messages: Message[];
	joinRoom: (chatName: ChatName) => void;
	joinPrivateRoom: (chatName: ChatName, password: string) => void;
	leaveRoom: (chatName: ChatName) => void;
	deleteChatRoom: (chatName: ChatName) => void;
	addChatRoom: (chatName: ChatName) => void;
	changeChatRoom :(chatName: ChatName) => void;
	updateChannellist: () => void;
	sendMessage: () => void;
	handleMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	message: string;
	allUsers: User[];
    allChannels: Channel[];
	generalChat: ChatData;
	loadingChannelPanel: boolean;
}

 export type ChatData = {
	isChannel: boolean;
	chatName: ChatName;
	receiverId: string | number;
	isResolved: boolean;
	Channel: Channel ;
};

export interface Message {
	sender: string;
	content: string;
}

// export interface User {
// 	id: string;
// 	username: string;
// }

let initialMessagesState: {
	[key: string]: { sender: string; content: string }[];
	//[key: number]: { sender: string; content: string }[];
} = {
	general: [],
	random: [],
	jokes: [],
	javascript: []
};

// let playerOne:string = "", playerTwo:string = "", audience:string = "";

export interface ChannelUserRoles {

	isUser: 			boolean,
	isUserResolved: 	boolean,
	isAdmin: 			boolean,
	isAdminResolved: 	boolean,
	isOwner:			boolean,
	isOwnerResolved:	boolean,
	isBlocked:			boolean,
	isBlockedResolved:	boolean,
	isMuted:			boolean,
	isMutedResolved:	boolean

}

export type ChatName = keyof typeof initialMessagesState;