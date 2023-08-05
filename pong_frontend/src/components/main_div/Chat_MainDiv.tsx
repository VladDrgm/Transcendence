import React, { FC,KeyboardEvent, useEffect, useState, useCallback, useMemo} from "react";
import styled from "styled-components";
import { renderUser, renderMessages, BodyContainer, ChannelInfo, ChatPanel, Container, Messages, SideBar, TextBox } from "../div/chat_utils"; 
import { Channel } from '../../interfaces/channel.interface';
import Channel_Div from '../div/channel_div';
import { mapChannel } from "../div/channel_utils";
import {addAdminPopUp, /*blockUserPopUp, */ banUserPopUp, kickUserPopUp, muteUserPopUp } from '../div/channel_popups';

// import { ChatName } from "./Arena_Chat";
import { deleteChannel} from '../../api/channel/channel.api';
import { getIsAdmin } from "../../api/channel/channel_admin.api";
import { getChannelUser, getChannelBlockedUser } from "../../api/channel/channel_user.api";
import  {ChatProps, Message} from '../../interfaces/channel.interface';
import { User } from "../../interfaces/user.interface";
import { ChannelAdmin_Buttons_Div, ChannelOwner_Buttons_Div } from "../div/channel_buttons_div";
import { getOwnerId } from "../../api/channel/channel_owner.api";
import ChatBody_Div from "../div/channel_ChatBody_div";


const Chat_MainDiv: FC<ChatProps> = (props) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAdminResolved, setIsAdminResolved] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isUserInChannel, setIsUserInChannel] = useState(false);
	const [isUserInChannelBlocked, setIsUserInChannelBlocked] = useState(false);
	const [body, setBody] = useState<JSX.Element | null>(null);
	const [channelpanel, setChannelpanel] = useState<JSX.Element | null>(null);
	const [loadingChannelpanel, setLoadingChannelpanel] = useState(true);
	// const [loadingChatBody, setLoadingChatBody] = useState(true);
	const [channelPanelLoaded, setChannelPanelLoaded] = useState(false);
  	// const [chatBodyLoaded, setChatBodyLoaded] = useState(false);

	const messages = useMemo(() =>
		props.messages || [], [props.messages])
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
		setBody(<ChatBody_Div
			props = {props}
			// isUserInChannelBlocked = {isUserInChannelBlocked}
			// isUserInChannel = {isUserInChannel}
			// isAdmin= {isAdmin}
			// isAdminResolved = {isAdminResolved}
			messages={messages}
			// loadingChatBody = {loadingChatBody}
		/>);
		// setChatBodyLoaded(true);
	}, [isUserInChannel, isUserInChannelBlocked, messages, props, isAdmin]);

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
		if (isOwner){
			  setChannelpanel(
				  <ChannelOwner_Buttons_Div{...props} loadingChannelPanel={loadingChannelpanel}/>
			  );
		  }
		else if (isAdmin && isAdminResolved) {
			setChannelpanel(
				<ChannelAdmin_Buttons_Div{...props} loadingChannelPanel={loadingChannelpanel}/>
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
		isOwner,
		isAdminResolved,
		isUserInChannelBlocked,
	]);

	useEffect(() => {
		// handleUserInChannelCheck();
		// handleUserInChannelBlockedCheck();
		// setLoadingChannelpanel(true);
    	// setLoadingChatBody(true);
		setLoadingChannelpanel(false);
		// setLoadingChatBody(false);
		// handleChannelPanel();
		// handleBody();
		// setIsAdminResolved(false);
	}, [props.currentChat, props.currentChat.isResolved, props.messages]);

	useEffect(() => {
		if (channelPanelLoaded) {
		  setLoadingChannelpanel(false);
		}
	}, [channelPanelLoaded]);
	
	// useEffect(() => {
	// 	if (chatBodyLoaded) {
	// 	  setLoadingChatBody(false);
	// 	}
	// }, [chatBodyLoaded]);
	
	useEffect(() => {
		handleChannelPanel();
		handleBody();
		// setLoadingChannelpanel(true);
	}, [props.currentChat, handleBody, handleChannelPanel, loadingChannelpanel]);


	// useEffect(() => {
	// 	setIsOwner(false);
	// 	if (!props.currentChat.isResolved)
	// 		return;

	// 	console.log("owner id:", props.currentChat.Channel.OwnerId);
	// 	console.log("UserID:", props.userID);
	// 	if (props.currentChat.Channel.OwnerId === props.userID){
	// 		setIsOwner(true);
	// 		console.log("true UserID:", props.userID , "owner:", isOwner);
	// 	} else {
	// 		setIsOwner(false);
	// 		console.log("false UserID:", props.userID , "owner:", isOwner);
	// 	};
	// }, [props.currentChat.isResolved, props.yourId, props.currentChat.isResolved]);

	// useEffect(() => {
	// 	setIsAdminResolved(false);
	// 	if (!props.currentChat.isResolved)
	// 		return;
		
	// 	getIsAdmin(props.currentChat.Channel.ChannelId, props.userID)
	// 	.then(isAdmin => {
	// 		setIsAdmin(isAdmin);
	// 		console.log("UserID:", props.userID , "admin:", isAdmin);
	// 		setIsAdminResolved(true);
	// 	})
	// 	.catch(error => {
	// 		console.log("Error checking admin status:", error)
	// 		setIsAdminResolved(true);
	// 	});
	// 	// handleUserInChannelCheck();
	// 	// setIsAdminResolved(false);
	// }, [props.currentChat.isResolved, props.yourId, props.currentChat.isResolved]);

	

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