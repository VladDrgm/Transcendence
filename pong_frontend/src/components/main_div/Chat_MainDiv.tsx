import React, { FC, useEffect, useState, useCallback, useMemo} from "react";
import { renderUser, BodyContainer, ChannelInfo, ChatPanel, Container, SideBar, TextBox } from "../div/chat_utils"; 
import Channel_Div from '../div/channel_div';
import { ChannelAdmin_Buttons_Div, ChannelOwner_Buttons_Div } from "../div/channel_buttons_div";
import ChatBody_Div from "../div/channel_ChatBody_div";
import ChatInput_Div from "../div/channel_ChatPanel_div";
import { ChatProps } from "../../interfaces/channel.interface";


const Chat_MainDiv: FC<ChatProps> = (props) => {
	const [body, setBody] = useState<JSX.Element | null>(null);
	const [chatInput, setChatInput] = useState<JSX.Element | null>(null);
	const [channelpanel, setChannelpanel] = useState<JSX.Element | null>(null);
	const [loadingChannelpanel, setLoadingChannelpanel] = useState(true);
	const [channelPanelLoaded, setChannelPanelLoaded] = useState(false);

	const messages = useMemo(() =>
		props.messages || [], [props.messages])

	const handleBody = useCallback (() =>{
		setBody(<ChatBody_Div
			props = {props}
			messages={messages}
		/>);
	}, [messages, props.ChannelUserRoles]);
	
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
		setChatInput(<ChatInput_Div props = {props}/>);
	}, [props.currentChat, handleBody, handleChannelPanel, loadingChannelpanel, props.ChannelUserRoles, messages]);
	
	useEffect(() => {
		handleChannelPanel();
		handleBody();
		setChatInput(<ChatInput_Div props = {props}/>);
	}, [props.currentChat, handleBody, handleChannelPanel, loadingChannelpanel, props.ChannelUserRoles]);

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
			{chatInput}
		</ChatPanel>
		</Container>
	);
};

export default Chat_MainDiv;