import React, { FC,KeyboardEvent, useEffect, useState, useCallback, useMemo} from "react";
import styled from "styled-components";
import { Channel } from '../../interfaces/channel.interface';
import Channel_Div from '../div/channel_div';
import { mapChannel } from "../div/channel_utils";
import {addAdminPopUp, /*blockUserPopUp, */ banUserPopUp } from '../div/channel_popups';
import { renderUser, renderMessages } from "../div/chat_utils"; 

// import { ChatName } from "./Arena_Chat";
import { deleteChannel} from '../../api/channel/channel.api';
import { getIsAdmin } from "../../api/channel/channel_admin.api";
import { getChannelUser, getChannelBlockedUser } from "../../api/channel/channel_user.api";
import  {ChatProps, Message} from '../../interfaces/channel.interface';
import { User } from "../../interfaces/user.interface";

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

export const Row = styled.div`
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
	const [channelpanel, setChannelpanel] = useState<JSX.Element | null>(null);
	const [loadingChannelpanel, setLoadingChannelpanel] = useState(true);
	const [loadingChatBody, setLoadingChatBody] = useState(true);
	const [channelPanelLoaded, setChannelPanelLoaded] = useState(false);
  	const [chatBodyLoaded, setChatBodyLoaded] = useState(false);

	// let body: JSX.Element | null = null;
	const messages = useMemo(() =>
		props.messages || [], [props.messages])
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
	const handleUserInChannelCheck = useCallback (async () => {
		try {
			if (!props.currentChat.isResolved){
				return;
			}
			setIsUserInChannel(await getChannelUser(props.userID, props.currentChat.Channel.ChannelId));
		}catch (error){
			console.error('Error occured in handleUserChannelCheck:', error);
		}
	}, [props.currentChat.isResolved, props.currentChat.Channel.ChannelId]);
	
	// sets the state IsUserInChannelBlocked to true if the user is blocked
	const handleUserInChannelBlockedCheck = useCallback (async () => {
		try {
			if (!props.currentChat.isResolved){
				return;
			}
			//replacing the user here with the real user when login finished
			setIsUserInChannelBlocked(await getChannelBlockedUser(props.userID, props.currentChat.Channel.ChannelId));
		}catch (error){
			console.error('Error occured in handleUserChannelBlockedCheck:', error);
		}
	}, [props.currentChat.isResolved, props.currentChat.Channel.ChannelId]);

	const handleBody = useCallback (() =>{
		if (isUserInChannelBlocked) {
			setBody ( 
				loadingChatBody ? (
				<div>Loading Chat...</div> // Show a loading spinner or placeholder
				) : (
					<TextBox>
						You are blocked from using this Channel.
					</TextBox>
					// setLoadingChatBody(true);
				)
			);
		} else if ((isUserInChannel || !props.currentChat.isChannel) || (isAdmin && isAdminResolved) || props.connectedRooms.includes(props.currentChat.chatName.toString())) {
			setBody (
				loadingChatBody ? (
					<div>Loading Chat...</div> // Show a loading spinner or placeholder
					) : (
					<Messages>
						{messages.map(renderMessages)}
					</Messages>)
				);
		} else {
			setBody (
				loadingChatBody ? (
					<div>Loading Chat...</div> // Show a loading spinner or placeholder
					) : (
					<button onClick={() => props.joinRoom(props.currentChat.chatName)}>
						Join {props.currentChat.chatName}
					</button>
					)
			);
		}
		setChatBodyLoaded(true);
	}, [isUserInChannel, isUserInChannelBlocked, loadingChatBody, messages, props, isAdmin]);

	const handleChannelPanel = useCallback(() =>{
		// setLoadingChannelpanel(false);
    	// setLoadingChatBody(false);
		setChannelpanel(
			loadingChannelpanel ? (
			  <div>Loading Channel Name...</div> // Show a loading spinner or placeholder
			) : (
			  <ChannelInfo>
				{props.currentChat.chatName}
				{/* <button onClick={() => props.leaveRoom(props.currentChat.chatName)}>
						Leave {props.currentChat.chatName}
					</button> */}
			  </ChannelInfo>
			  
			)
		  );
		if ((isUserInChannel && !isUserInChannelBlocked)|| (isAdmin && isAdminResolved) ) {
			setChannelpanel(
				loadingChannelpanel ? (
					<div>Loading Channel Name and Buttons...</div> // Show a loading spinner or placeholder
				) : (
					<ChannelInfo>
						{props.currentChat.chatName}
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
					</ChannelInfo>
				)
			);
		}
		setChannelPanelLoaded(true);
	}, [
		props,
		/*props.currentChat.chatName,
		props.currentChat.Channel.ChannelId,*/
		loadingChannelpanel,
		isUserInChannel,
		isAdmin,
		isAdminResolved,
		isUserInChannelBlocked,
	]);

	useEffect(() => {
		handleUserInChannelCheck();
		handleUserInChannelBlockedCheck();
		// setLoadingChannelpanel(true);
    	// setLoadingChatBody(true);
		setLoadingChannelpanel(false);
		setLoadingChatBody(false);
		// handleChannelPanel();
		// handleBody();
		// setIsAdminResolved(false);
	}, [props.currentChat, props.currentChat.isResolved, props.messages, handleUserInChannelBlockedCheck, handleUserInChannelCheck]);

	useEffect(() => {
		if (channelPanelLoaded) {
		  setLoadingChannelpanel(false);
		}
	}, [channelPanelLoaded]);
	
	useEffect(() => {
		if (chatBodyLoaded) {
		  setLoadingChatBody(false);
		}
	}, [chatBodyLoaded]);
	
	useEffect(() => {
		handleChannelPanel();
		handleBody();
		// setLoadingChannelpanel(true);
		// setLoadingChatBody(true);
	}, [props.currentChat, handleBody, handleChannelPanel, loadingChannelpanel, loadingChatBody]);


	//checks if a user is Admin and sets the isAdmin to true or false
	//using yourID as UserId here, maybe neede to be updated later
	useEffect(() => {
		setIsAdminResolved(false);
		if (!props.currentChat.isResolved)
			return;
		
		getIsAdmin(props.currentChat.Channel.ChannelId, props.userID)
		.then(isAdmin => {
			setIsAdmin(isAdmin);
			console.log("UserID:", props.userID , "admin:", isAdmin);
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
			{props.allUsers.map((user) => renderUser(user, props))}
		</SideBar>
		<ChatPanel>
			<ChannelInfo>
				{channelpanel}
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