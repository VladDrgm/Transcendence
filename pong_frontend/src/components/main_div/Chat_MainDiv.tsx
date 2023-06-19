import React, { FC, ChangeEvent, KeyboardEvent } from "react";
import styled from "styled-components";

import { ChatName } from "./Arena_Chat";
// // parts of the Arena file
// //start
// let initialMessagesState: {
// 	[key: string]: { sender: string; content: string }[];
// 	//[key: number]: { sender: string; content: string }[];
// } = {
//   general: [],
//   random: [],
//   jokes: [],
//   javascript: []
// };

// export type ChatName = keyof typeof initialMessagesState;

// type CurrentChat = {
// 	isChannel: boolean;
// 	chatName: ChatName;
// 	receiverId: string;
//   };
// // end


interface ChatProps {
	toggleChat: (currentChat: ChatData) => void;
	yourId: string | number;
	username: string;
	currentChat: ChatData;
	connectedRooms: string[];
	messages: Message[];
	joinRoom: (chatName: ChatName) => void;
	sendMessage: () => void;
	handleMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	message: string;
	allUsers: User[];
}

type ChatData = {
	isChannel: boolean;
	chatName: ChatName;
	receiverId: string;
};

interface Message {
	sender: string;
	content: string;
}

interface User {
	id: string;
	username: string;
}

let rooms = ["general", "random", "jokes", "javascript"];

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
`;

const SideBar = styled.div`
  height: 100%;
  width: 15%;
  border-right: 1px solid black;
`;

const ChatPanel = styled.div`
  height: 100%;
  width: 85%;
  display: flex;
  flex-direction: column;
`;

const BodyContainer = styled.div`
  width: 100%;
  height: 75%;
  overflow: scroll;
  border-bottom: 1px solid black;
`;

const TextBox = styled.textarea`
  height: 15%;
  width: 100%;
`;

const ChannelInfo = styled.div`
  height: 10%;
  width: 100%;
  border-bottom: 1px solid black;
`;

const Row = styled.div`
  cursor: pointer;
`;

const Messages = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Chat_MainDiv: FC<ChatProps> = (props) => {
	function renderRooms(room: string) {
		let currentChat: ChatData = {
		chatName: room,
		isChannel: true,
		receiverId: "",
		};
		return (
		<Row onClick={() => props.toggleChat(currentChat)} key={room}>
			{room}
		</Row>
		);
	}

	function renderUser(user: User) {
		console.log("User id is: " + user.id);
		console.log("User.username is: " + user.username);
		console.log("Props id is: " + props.yourId);
		console.log("Props username is: " + props.username);
		if (user.id === props.yourId) {
		return (
			<Row key={user.id}>
			You: {props.username}
			</Row>
		);
		}
		const currentChat: ChatData = {
		chatName: user.username,
		isChannel: false,
		receiverId: user.id,
		};
		console.log("Reached here");
		return (
		<Row onClick={() => {
			props.toggleChat(currentChat);
		}} key={user.id}>
			{user.username}
		</Row>
		);
	}

	function renderMessages(message: Message, index: number) {
		return (
		<div key={index}>
			<h3>{message.sender}</h3>
			<p>{message.content}</p>
		</div>
		);
	}

	let body;
	if (!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName.toString())) {
		body = (
		<Messages>
			{props.messages.map(renderMessages)}
		</Messages>
		);
	} else {
		body = (
		<button onClick={() => props.joinRoom(props.currentChat.chatName)}>
			Join {props.currentChat.chatName}
		</button>
		);
	}

	function handleKeyPress(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter") {
		props.sendMessage();
		}
	}

	return (
		<Container>
		<SideBar>
			<h3>Channels</h3>
			{rooms.map(renderRooms)}
			<h3>All Users</h3>
			{props.allUsers.map(renderUser)}
		</SideBar>
		<ChatPanel>
			<ChannelInfo>
			{props.currentChat.chatName}
			</ChannelInfo>
			<BodyContainer>
			{body}
			</BodyContainer>
			<TextBox
			value={props.message}
			onChange={props.handleMessageChange}
			onKeyPress={handleKeyPress}
			placeholder="You can write something here"
			/>
		</ChatPanel>
		</Container>
	);
};

export default Chat_MainDiv;