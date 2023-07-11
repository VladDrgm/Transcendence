import React, { FC, ChangeEvent, KeyboardEvent, useEffect, useLayoutEffect, useState , Suspense} from "react";
import styled from "styled-components";
import { Channel } from '../../interfaces/channel.interface';
import Channel_Div from '../div/channel_div';
import {addAdminPopUp, blockUserPopUp, banUserPopUp } from '../div/channel_div';

import { ChatName } from "./Arena_Chat";
import { deleteChannel, getChannels, getIsAdmin, postAdmin, getChannelUser, getChannelBlockedUser } from '../../api/channel.api';
import  {ChatProps, ChatData, Message, User} from '../../interfaces/channel.interface';


function mapChannel(item: any) {
    const { ChannelId, OwnerId, Name, Type, Password } = item;
    return {
        ChannelId,
        OwnerId,
        Name,
        Type,
        Password
    };
}


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
  height: 50%;
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
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAdminResolved, setIsAdminResolved] = useState(false);
	const [isUserInChannel, setIsUserInChannel] = useState(false);
	const [isUserInChannelBlocked, setIsUserInChannelBlocked] = useState(false);
	const [body, setBody] = useState<JSX.Element | null>(null);
	function renderUser(user: User) {
		// console.log("User id is: " + user.id);
		// console.log("User.username is: " + user.username);
		// console.log("Props id is: " + props.yourId);
		// console.log("Props username is: " + props.username);
		if (user.id === props.yourId) {
			// console.log("Reached here");
		return (
			<Row key={user.id}>
			You: {props.username}
			</Row>
		);
		}
		// console.log("Reached here");
		const currentChat: ChatData = {
		chatName: user.username,
		isChannel: false,
		receiverId: user.id,
		isResolved: true,
		Channel: {} as Channel,
		};
		// console.log("Reached here");
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

	// let body: JSX.Element | null = null;
	const messages = props.messages || [];
	// if (!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName.toString())) {
	// 	body = (
	// 	<Messages>
	// 		{messages.map(renderMessages)}
	// 	</Messages>
	// 	);
	// } else {
	// 	body = (
	// 	<button onClick={() => props.joinRoom(props.currentChat.chatName)}>
	// 		Join {props.currentChat.chatName}
	// 	</button>
	// 	);
	// }
	const handleUserInChannelCheck = async () => {
		try {
			if (!props.currentChat.isResolved){
				return;
			}
			//replacing the user here with the real user when login finished
			setIsUserInChannel(await getChannelUser(1, props.currentChat.Channel.ChannelId));
		}catch (error){
			console.error('Error occured in handleUserChannelCheck:', error);
		}
	};
	// sets the state IsUserInChannelBlocked to true if the user is blocked
	const handleUserInChannelBlockedCheck = async () => {
		try {
			if (!props.currentChat.isResolved){
				return;
			}
			//replacing the user here with the real user when login finished
			setIsUserInChannelBlocked(await getChannelBlockedUser(1, props.currentChat.Channel.ChannelId));
		}catch (error){
			console.error('Error occured in handleUserChannelBlockedCheck:', error);
		}
	};

	const handleBody = async () =>{
		if (isUserInChannelBlocked) {
			setBody (
				<TextBox>
					You are blocked from using this Channel.
				</TextBox>
			)
		} else if (isUserInChannel || !props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName.toString())) {
			setBody (
				<Messages>
					{messages.map(renderMessages)}
				</Messages>);
		} else {
			setBody (
			<button onClick={() => props.joinRoom(props.currentChat.chatName)}>
				Join {props.currentChat.chatName}
			</button>
			);
		}
	};

	useEffect(() => {
		handleUserInChannelCheck();
		handleUserInChannelBlockedCheck();
		handleBody();
		// setIsAdminResolved(false);
	}, [props.currentChat, props.currentChat.isResolved, isUserInChannel, isUserInChannelBlocked, props.messages]);

	//checks if a user is Admin and sets the isAdmin to true or false
	//using yourID as UserId here, maybe neede to be updated later
	useEffect(() => {
		setIsAdminResolved(false);
		if (!props.currentChat.isResolved)
			return;
		
		getIsAdmin(props.currentChat.Channel.ChannelId, 2)
		.then(isAdmin => {
			setIsAdmin(isAdmin);
			setIsAdminResolved(true);
		})
		.catch(error => {
			console.log("Error checking admin status:", error)
			setIsAdminResolved(true);
		});
		// handleUserInChannelCheck();
		// setIsAdminResolved(false);
	}, [props.currentChat.Channel.ChannelId, props.yourId, props.currentChat.isResolved]);

	function handleKeyPress(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter") {
		props.sendMessage();
		}
	}

	return (
		<Container>
		<SideBar>
			<Channel_Div{...props}/>
			<h3>All Users</h3>
			{props.allUsers.map(renderUser)}
		</SideBar>
		<ChatPanel>
			<ChannelInfo>
			{props.currentChat.chatName}
			{/* {isAdminResolved && isAdmin && ( */}
			{(
			<div>
				<button
				onClick={() => deleteChannel(props.currentChat.Channel.ChannelId)}>
				Delete Channel
				</button>
				<button
				onClick={() => addAdminPopUp(props)}>
				Add Admin
				</button>
				<button
				onClick={() => banUserPopUp(props)}>
				Ban/Unban/Kick User
				</button>
			</div>
			)}
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