import React from "react";
import { Invitation, User } from "./User";
import { Socket } from "socket.io-client";

export interface Channel {
	ChannelId: number;
 	OwnerId: number;
  	Name: string;
  	Type: string;
  	Password: string;
}

export interface ChatProps {
	userID: number | undefined;
	user: User | null;
	yourId: string | number;
	allUsers: User[];
	invitePlayer:(invitation:Invitation) => void;
  	friend_set: React.Dispatch<React.SetStateAction<number>>;
	invitation: Invitation;
	socketRef: React.MutableRefObject<Socket | null>;
	chatMainDivRef: React.MutableRefObject<any>;
}

 export type ChatData = {
	isChannel: boolean;
	chatName: ChatName;
	chatId: string | undefined;
	receiverId: string | number;
	senderId: string | undefined;
	isResolved: boolean;
	Channel: Channel ;
};

export interface Message {
	sender: string | undefined;
	content: string;
}

export interface Channel_Div_props {
	ChatProps: ChatProps;
	allChannels: Channel[];
	toggleChat: (currentChat: ChatData) => void;
	updateChannellist: any;
	addChatRoom: (chatName: ChatName) => void;
	currentChat: ChatData;
	joinPrivateRoom: (chatName: ChatName, password: string) => void;
	
}

let initialMessagesState: {
	[key: string]: { sender: string; content: string }[];
} = {
	general: [],
};

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