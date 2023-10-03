import React from "react";
import { Invitation, User } from "./User";
import { Socket } from "socket.io-client";
// import { CurrentChat } from "../components/mainPages/Arena_Chat";
// import { main_div_mode_t } from "../components/MainDivSelector";

export interface Channel {
	ChannelId: number;
 	OwnerId: number;
  	Name: string;
  	Type: string;
  	Password: string;
}

export interface ChatProps {
	userID: number | undefined; //userID from login process
	user: User | null; //USer from login process
	// toggleChat: (currentChat: ChatData) => void;
	yourId: string | number;  //socketId from joining the game
	// username: string; //name given in the game startpage
	// currentChat: ChatData;
	// ChannelUserRoles: ChannelUserRoles;
	// // handleAdminCheck: () => void;
	// addAdminRights: (TargetName: string, chatName: ChatName) => void;
	// banUserSocket: (targetId: number, chatName: ChatName) => void;
	// unbanUserSocket: (targetId: number, chatName: ChatName) => void;
	// muteUserSocket: (targetId: number, chatName: ChatName, mutedDuration: number) => void;
	// connectedRooms: string[];
	// messages: Message[];
	// joinRoom: (chatName: ChatName) => void;
	// joinPrivateRoom: (chatName: ChatName, password: string) => void;
	// leaveRoom: (chatName: ChatName) => void;
	// deleteChatRoom: (chatName: ChatName) => void;
	// addChatRoom: (chatName: ChatName) => void;
	// addBlockedUser: (targetName: ChatName) => void;
	// addFriend: (targetName: ChatName) => void;
	// removeFriend: (targetName: ChatName) => void;

	// unblockUser: (targetName: ChatName) => void;
	// changeChatRoom :(chatName: ChatName) => void;
	// updateChannellist: () => void;
	// sendMessage: () => void;
	// handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	// message: string;
	// setMessage: React.Dispatch<React.SetStateAction<string>>;
	allUsers: User[];
    // allChannels: Channel[];
	// generalChat: ChatData;
	// loadingChannelPanel: boolean;
	invitePlayer:(invitation:Invitation) => void;
	// mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  	friend_set: React.Dispatch<React.SetStateAction<number>>;
	invitation: Invitation;
	socketRef: React.MutableRefObject<Socket | null>;
	chatMainDivRef: React.MutableRefObject<any>;
}

 export type ChatData = {
	isChannel: boolean;
	chatName: ChatName;
	receiverId: string | number;
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
	// joinRoom: (chatName: ChatName) => void;
	toggleChat: (currentChat: ChatData) => void;
	updateChannellist: () => void;
	addChatRoom: (chatName: ChatName) => void;
	currentChat: ChatData;
	joinPrivateRoom: (chatName: ChatName, password: string) => void;
	
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