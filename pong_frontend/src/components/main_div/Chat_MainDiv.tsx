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
// import ChatPanel_Div from "../div/channel_ChatPanel_div";


const Chat_MainDiv: FC<ChatProps> = (props) => {
	const [body, setBody] = useState<JSX.Element | null>(null);
	const [chatPanel, setChatPanel] = useState<JSX.Element | null>(null);
	const [channelpanel, setChannelpanel] = useState<JSX.Element | null>(null);
	const [loadingChannelpanel, setLoadingChannelpanel] = useState(true);
	const [channelPanelLoaded, setChannelPanelLoaded] = useState(false);

	const messages = useMemo(() =>
		props.messages || [], [props.messages])

	// const handleUserInChannelCheck = useCallback (async () => {
	// 	try {
	// 		if (!props.currentChat.isResolved){
	// 			return;
	// 		}
	// 		setIsUserInChannel(await getChannelUser(props.userID, props.currentChat.Channel.ChannelId));
	// 	}catch (error){
	// 		console.error('Error occured in handleUserChannelCheck:', error);
	// 	}
	// }, [props.currentChat.isResolved, props.currentChat.Channel.ChannelId]);
	
	// // sets the state IsUserInChannelBlocked to true if the user is blocked
	// const handleUserInChannelBlockedCheck = useCallback (async () => {
	// 	try {
	// 		if (!props.currentChat.isResolved){
	// 			return;
	// 		}
	// 		//replacing the user here with the real user when login finished
	// 		setIsUserInChannelBlocked(await getChannelBlockedUser(props.userID, props.currentChat.Channel.ChannelId));
	// 	}catch (error){
	// 		console.error('Error occured in handleUserChannelBlockedCheck:', error);
	// 	}
	// }, [props.currentChat.isResolved, props.currentChat.Channel.ChannelId]);

	const handleBody = useCallback (() =>{
		setBody(<ChatBody_Div
			props = {props}
			messages={messages}
		/>);
	}, [messages, props.ChannelUserRoles]);
	
	// const handleChatPanel = useCallback (() =>{
	// 	setBody(<ChatPanel_Div
	// 		props = {props}
	// 		handleKeyPress = {handleKeyPress}
	// 	/>);
	// }, [props.ChannelUserRoles]);

	const handleChannelPanel = useCallback(() =>{
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
		if (props.ChannelUserRoles.isOwner){
			  setChannelpanel(
				  <ChannelOwner_Buttons_Div{...props} loadingChannelPanel={loadingChannelpanel}/>
			  );
		  }
		else if (props.ChannelUserRoles.isAdmin && props.ChannelUserRoles.isAdminResolved) {
			setChannelpanel(
				<ChannelAdmin_Buttons_Div{...props} loadingChannelPanel={loadingChannelpanel}/>
			);
		} 
		setChannelPanelLoaded(true);
	}, [
		props,
		loadingChannelpanel,
	]);

	useEffect(() => {
		setLoadingChannelpanel(false);
	}, [props.currentChat, props.currentChat.isResolved, props.messages]);

	useEffect(() => {
		if (channelPanelLoaded) {
		  setLoadingChannelpanel(false);
		}
	}, [channelPanelLoaded]);
	
	useEffect(() => {
		handleChannelPanel();
		handleBody();
		// handleChatPanel();
	}, [props.currentChat, handleBody, handleChannelPanel, loadingChannelpanel, props.ChannelUserRoles]);


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
			{/* {chatPanel} */}
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