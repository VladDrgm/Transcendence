import React, { FC, ChangeEvent, KeyboardEvent } from "react";

export interface Channel {
	ChannelId: number;
 	OwnerId: number;
  	Name: string;
  	Type: string;
  	Password: string;
}

export interface ChatProps {
	toggleChat: (currentChat: ChatData) => void;
	yourId: string | number;
	username: string;
	currentChat: ChatData;
	connectedRooms: string[];
	messages: Message[];
	joinRoom: (chatName: ChatName) => void;
	leaveRoom: (chatName: ChatName) => void;
	sendMessage: () => void;
	handleMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	message: string;
	allUsers: User[];
    allChannels: Channel[];
}

 export type ChatData = {
	isChannel: boolean;
	chatName: ChatName;
	receiverId: string;
	isResolved: boolean;
	Channel: Channel;
};

export interface Message {
	sender: string;
	content: string;
}

export interface User {
	id: string;
	username: string;
}

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