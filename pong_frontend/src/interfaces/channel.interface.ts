import React, { FC, ChangeEvent, KeyboardEvent } from "react";
import { User } from "./user.interface";
import { Socket } from "socket.io-client";

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
	yourId: Socket | null;  //socketId from joining the game
	username: string; //name given in the game startpage
	currentChat: ChatData;
	connectedRooms: string[];
	messages: Message[];
	joinRoom: (chatName: ChatName, channelStatus: string, password: string) => void;
	leaveRoom: (chatName: ChatName) => void;
	sendMessage: () => void;
	handleMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	message: string;
	allUsers: User[];
    allChannels: Channel[];
	loadingChannelPanel: boolean;
	gameSessionId: string | null;
}

 export type ChatData = {
	isChannel: boolean;
	chatName: ChatName;
	receiverId: Socket | null;
	isResolved: boolean;
	Channel: Channel;
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

export type ChatName = keyof typeof initialMessagesState;