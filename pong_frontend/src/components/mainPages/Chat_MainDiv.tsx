import React, { FC, useEffect, useState, useCallback, useMemo, useReducer, useRef} from "react";
import { renderUser} from "../div/chat_utils"; 
import {ChatContainerStyle, BodyContainer, ChannelInfo, ChatPanel, Container, SideBar, TextBox } from "./ChatPageStyles";
import Channel_Div from '../div/channel_div';
import { ChannelAdmin_Buttons_Div, ChannelOwner_Buttons_Div } from "../div/channel_buttons_div";
import ChatBody_Div from "../div/channel_ChatBody_div";
import ChatInput_Div from "../div/channel_ChatPanel_div";
import { Channel, ChannelUserRoles, ChatName, ChatProps } from "../../interfaces/channel.interface";
import { chatInputProps } from "../div/channel_ChatPanel_div";
// import { main_div_mode_t } from "../MainDivSelector";
import { fetchAllChannels, getUserIDByUserName } from "../div/channel_utils";
import { User } from "../../interfaces/user.interface";
import { deleteChannelUser, getBlockedUser, getChannelBlockedUser, getChannelUser, getMutedStatus, postChannelUser, postPrivateChannelUser } from "../../api/channel/channel_user.api";
import { CurrentChat, WritableDraft, getChannelFromChannellist, initialMessagesState, initializeMessagesState } from "./Arena_Chat";
import immer, { Draft } from "immer";
import { getIsAdmin, postAdmin } from "../../api/channel/channel_admin.api";

const Chat_MainDiv: FC<ChatProps> = (props) => {
	const [body, setBody] = useState<JSX.Element | null>(null);
	const [chatInput, setChatInput] = useState<JSX.Element | null>(null);
	const [channelpanel, setChannelpanel] = useState<JSX.Element | null>(null);
	const [loadingChannelpanel, setLoadingChannelpanel] = useState(true);
	const [channelPanelLoaded, setChannelPanelLoaded] = useState(false);
	const [allChannels, setAllChannels] = useState<any[]>([]);
	const [currentChat, setCurrentChat] = useState<CurrentChat>({
		isChannel: true,
		chatName: "general",
		receiverId: "",
		isResolved: true,
		Channel: {
			ChannelId: 41,
			OwnerId: 1,
			Name: 'general',
			Type: "public",
			Password: ""
		} as Channel,
	});
	const[generalChat, setGeneralChat] = useState<CurrentChat>({
		isChannel: true,
		chatName: "general",
		receiverId: "",
		isResolved: true,
		Channel: {
			ChannelId: 41,
			OwnerId: 1,
			Name: 'general',
			Type: "public",
			Password: ""
		} as Channel,
	});

	//CHANNELS
		//Populating the Channellist at Mount of Arena
		//Filling Channel of currentChat variable with the fetched Channel Object
	useEffect(() => {
		try {
			fetchAllChannels()
				.then((channels) => {
					setAllChannels(channels);
					const currentChannel = getChannelFromChannellist(channels, "general");
					console.log("Channels: ", currentChannel);
					if (currentChannel) {
						// console.log("gotChannel");
						setCurrentChat((prevState) => ( {
							...prevState,
							Channel: currentChannel,
						}));
						setGeneralChat((prevState) => ({
							...prevState,
							Channel:currentChannel
						}));
					}
				})
				.catch((error) => {
					console.error("Error fetching all Channels: ", error);
				});
		} catch(error) {
			console.error('Error fetching all Channels:', error);
		}
	}, []);

	function updateChannellist(){
		fetchAllChannels()
		.then((channels) => {
			setAllChannels(channels);
		});
	}

	
	//MESSAGES
	useEffect(() => {initializeMessagesState();},[]);

	const [messages, setMessages] = useState<{
		[key in ChatName]: { sender: string | undefined; content: string }[];
	}>(initialMessagesState);
		// console.log('initialMessageState:', initialMessagesState);

	const [message, setMessage] = useState("");

	function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setMessage(e.target.value);
	}

	useEffect(() => {
    	setMessage(message.trim());
  	}, [message]);

	function sendMessage() {
		console.log("message:", message);
		console.log("Messages :", messages);
		console.log("currentchat: ", currentChat);
		console.log("username : ", props.user?.username);
		const payload = {
		content: message,
		to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
		sender: props.user?.username,
		chatName: currentChat.chatName,
		isChannel: currentChat.isChannel
		};

		props.socketRef.current?.emit("send message", payload);
		const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
		//if the element doesn't exist, an empty one will be added
		// console.log('Inside Immer callback');
			if(!draft[currentChat.chatName]) {
				draft[currentChat.chatName] = [];
			}
			draft[currentChat.chatName].push({
				sender: props.user?.username,
				content: message
			});
		});
		console.log('New Messages:', newMessages);
		setMessages(newMessages);
		setMessage("");
	}


		// const messages = useMemo(() =>
		// 	props.messages || [], [props.messages])

	function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter") {
		sendMessage();
		// setLocalMessage('');
		}
	}

	function newMessages(content: string, sender: string, chatName: ChatName ){
		setMessages(messages => {
			const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
				if (draft[chatName]) {
					draft[chatName].push({ content, sender });
				} else {
					draft[chatName] = [{ content, sender }];
				}
			});
			return newMessages;
		});
	}

	
	// currentRoles states and functions

	const [currentRoles, setCurrentRoles] = useState<ChannelUserRoles>({
		isUser: 			true,
		isUserResolved: 	true,
		isAdmin: 			false,
		isAdminResolved: 	true,
		isOwner:			false,
		isOwnerResolved:	true,
		isBlocked:			false,
		isBlockedResolved:	true,
		isMuted:			false,
		isMutedResolved:	true
	});

	useEffect(() => {
		if (currentChat.isChannel){
			handleUserInChannelCheck();
			handleUserInChannelBlockedCheck();
			handleUserInChannelMutedCheck();
			handleAdminCheck();
			handleOwnerCheck();
		}
		else if(!currentChat.isChannel){
			handleUserDirektMessageStatus();
		}
		console.log("in effect currentChat:", currentChat);
	}, [currentChat.chatName])


	const handleUserDirektMessageStatus = useCallback (async () => {
		setCurrentRoles((prevState) => ({
			...prevState,
			isBlockedResolved: false
		}));
		if (!currentChat.isResolved){
			return;
		}
		getUserIDByUserName(currentChat.chatName.toString())
			.then((result) => {
				if(result !== undefined){
					getBlockedUser(result, props.user?.userID)
					.then((user) => {
						setCurrentRoles((prevState) => ( {
							...prevState,
							isBlocked: user,
							isBlockedResolved: true
						}));
					}).catch(error => {
						console.log("Error blocking User:", error);
						alert("Error while blocking User");
					});
				}
			}).catch(error =>{
			console.error('Error occured in handleUserChannelCheck:', error);
			});
	}, [currentChat.isResolved, currentChat.chatName]);

	const handleUserInChannelCheck = useCallback (async () => {
		setCurrentRoles((prevState) => ({
			...prevState,
			isUserResolved: false
		}));
		if(currentChat.chatName === "general"){
			setCurrentRoles((prevState) => ({
				...prevState,
				isUser: true,
				isUserResolved: true
			}))
			return;
		}
		try {
			if (!currentChat.isResolved){
				return;
			}
			getChannelUser(props.user?.userID, currentChat.Channel.ChannelId)
				.then((user) => {
					setCurrentRoles((prevState) => ( {
						...prevState,
						isUser: !!user,
						isUserResolved: true
					}));
				})
		}catch (error){
			console.error('Error occured in handleUserChannelCheck:', error);
		}
	}, [currentChat.isResolved, currentChat.Channel.ChannelId]);



	const handleUserInChannelBlockedCheck = useCallback (async () => {
		setCurrentRoles((prevState) => ({
			...prevState,
			isBlockedResolved: false
		}));
		try {
			if (!currentChat.isResolved){
				return;
			}
			getChannelBlockedUser(props.user?.userID, currentChat.Channel.ChannelId)
				.then((user) => {
					setCurrentRoles((prevState) => ({
						...prevState,
						isBlocked:	user,
						isBlockedResolved: true
					}));
				})
		}catch (error){
			console.error('Error occured in handleUserChannelMutedCheck:', error);}
	}, [currentChat.isResolved, currentChat.Channel.ChannelId]);

	const handleUserInChannelMutedCheck = useCallback (async () => {
		setCurrentRoles((prevState) => ({
			...prevState,
			isMutedResolved: false
		}));
		try {
			if (!currentChat.isResolved){
				return;
			}
			getMutedStatus(currentChat.Channel.ChannelId, props.user?.userID)
				.then((response) => {
					setCurrentRoles((prevState) => ({
						...prevState,
						isMuted:	response,
						isMutedResolved: true
					}));
				})
		}catch (error){
			console.error('Error occured in handleUserChannelBlockedCheck:', error);}
	}, [currentChat.isResolved, currentChat.Channel.ChannelId]);

	const handleAdminCheck = useCallback (async () => {
		setCurrentRoles((prevState) => ({
			...prevState,
			isAdminResolved: false
		}));
		try {
			if (!currentChat.isResolved){
				return;
			}
			getIsAdmin(currentChat.Channel.ChannelId, props.user?.userID)
				.then((user) => {
					setCurrentRoles((prevState) => ({
						...prevState,
						isAdmin:	user,
						isAdminResolved: true
					}));
				})
		}catch (error){
					console.error('Error occured in handleAdminCheck:', error);}
	}, [currentChat.isResolved, currentChat.Channel.ChannelId]);

	const handleOwnerCheck = useCallback (async () => {
		setCurrentRoles((prevState) => ({
			...prevState,
			isOwnerResolved: false
		}));
		if (!currentChat.isResolved)
			return;
		var ownerStatus = false;
		if (currentChat.Channel.OwnerId === props.user?.userID){
			ownerStatus = true;
			// console.log("true UserID:", userID , "owner:", ownerStatus);
		} else {
			ownerStatus = false;
			// console.log("false UserID:", userID , "owner:", ownerStatus);
		};
		setCurrentRoles((prevState) => ({
			...prevState,
			isOwner:	ownerStatus,
			isOwnerResolved: true
		}));		
	}, [currentChat.isResolved, currentChat.Channel.ChannelId]);

	// FUNKTIONS FOR CHATROOMS
	function joinRoom(chatName: ChatName) {
		console.log("Posting User ", props.user?.userID, " in Channel:", currentChat.Channel.ChannelId);
		postChannelUser(props.user?.userID, currentChat.Channel.ChannelId)
			.then(()=> {
			props.socketRef.current?.emit("join room", chatName, (messages: any) => roomJoinCallback(messages, chatName))
			setCurrentRoles((prevState) => ({
				...prevState,
				isUser: true
			}))
			}).catch(error => {
				console.error("Error in joinRoom when adding User to Channel: ", error);
			});
	}

	function leaveRoom(chatName: ChatName) {
		console.log("Removing User ", props.user?.userID, " from Channel:", currentChat.Channel.ChannelId);
		deleteChannelUser(props.user?.userID, currentChat.Channel.ChannelId);
	}

	function roomJoinCallback(incomingMessages: any, room: keyof typeof messages) {
		const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
			draft[room] = incomingMessages;
		});
		setMessages(newMessages);
	}

	props.chatMainDivRef.current = {
		roomJoinCallback: roomJoinCallback,
		newMessages: newMessages,
		handleDeletingChatRoom: handleDeletingChatRoom,
		updateChannellist: updateChannellist,
		handleAdminRights: handleAdminRights,
		handleBannedUserSocket: handleBannedUserSocket,
		handleUnbannedUserSocket: handleUnbannedUserSocket,
		handleMutedUserSocket: handleMutedUserSocket,
		handleUnmutedUserSocket: handleUnmutedUserSocket,
		handleBlockedUserSocket: handleBlockedUserSocket,
		handleunblockedUserSocket: handleunblockedUserSocket,


	};
	// const proroomJoinCallbackRef = useRef<(incomingMessages: any, room: keyof typeof messages) => void>(roomJoinCallback);




	function joinPrivateRoom(chatName: ChatName, password: string) {
		postPrivateChannelUser(props.user?.userID, currentChat.Channel.ChannelId, password)
		.then(() => {
				console.log("Posting User ", props.user?.userID, " in Channel:", currentChat.Channel.ChannelId);
				props.socketRef.current?.emit("join room", chatName, (messages: any) => roomJoinCallback(messages, chatName));
				setCurrentRoles((prevState) => ({
					...prevState,
					isUser: true
				}));
			})
			.catch(error => {
				console.error("Error in joinPrivateRoom when adding User to Channel: ", error);
				alert("Wrong Password. Pleayse try again");
			});
	}

	function handleDeletingChatRoom(roomName: string | number){
		updateChannellist();
		setCurrentChat((prevChat) => {
			if (prevChat.chatName === roomName) {
				alert("The Chat has been deleted by the Owner.");
			return generalChat;
			} else {
			return prevChat;
			}
		});
	}

	async function toggleChat(newCurrentChat: CurrentChat) {
		props.socketRef.current?.emit("join room", newCurrentChat.chatName, (messages: any) => roomJoinCallback(messages, newCurrentChat.chatName));
		
		if (!messages[newCurrentChat.chatName]) {
		const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
			draft[newCurrentChat.chatName] = [];
			console.log("newEmpty");
		});
		
		setMessages(newMessages);
		}
		setCurrentChat(newCurrentChat);
	}

	function addAdminRights(newAdminUsername: string, roomName: string | number){
		getUserIDByUserName(newAdminUsername)
			.then((targetID) => {
				if(targetID === undefined){
					alert("User could not be found. Please try another Username.");
					return;
				}
				postAdmin(currentChat.Channel.ChannelId, Number(targetID), props.user?.userID)
				.then(() => {
					console.log('Admin added with UserId:', targetID);
					const data = {
						newAdminUserID: Number(targetID),
						roomName: roomName
					};
					props.socketRef.current?.emit('add admin', data);
				})
				.catch(error => {
					console.error("Error posting admin with Username:" , newAdminUsername);
					alert("Error while adding User as Admin");
				})
			})
			.catch(error => {
				console.error('Error getting UerID from User:' ,error);
				alert("Error while adding User as Admin");
			});
	}

	function handleAdminRights(newAdminUserID: number, roomName: string) {
		if (newAdminUserID === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
			// console.log("currenchat", prevChat.chatName);
				if( prevChat.chatName === roomName){
					alert("You are now an admin of this Channel.");
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isAdmin: true
					}));
				}
				return prevChat;
			});
			// console.log("currenchat", currentChat.chatName);
		}
	}

	function handleBannedUserSocket(targetId: number, roomName: string) {
		console.log("targetID", targetId);
		console.log("userId", props.user?.userID);
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
			console.log("currenchat", prevChat.chatName);

				if( prevChat.chatName === roomName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isBlocked: true
					}));
				}
				return prevChat;
			});
			console.log("currenchat", currentChat.chatName);
		}
	}

	function handleUnbannedUserSocket(targetId: number, roomName: string) {
		console.log("targetID", targetId);
		console.log("userId", props.user?.userID);
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
			// console.log("currenchat", prevChat.chatName);

				if( prevChat.chatName === roomName){
					alert("You can use this Channel again.")
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isBlocked: false
					}));
				}
				return prevChat;
			});
			// console.log("currenchat", currentChat.chatName);
		}
	}

	function handleUnmutedUserSocket(targetId: number, roomName: string) {
		console.log("targetID", targetId);
		console.log("userId", props.user?.userID);
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
			console.log("currenchat", prevChat.chatName);
	
				if( prevChat.chatName === roomName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isMuted: false
					}));
					alert("You have been unmuted.");
				}
				return prevChat;
			});
			console.log("currenchat", currentChat.chatName);
		}
	}
	
	function handleMutedUserSocket(targetId: number, roomName: string) {
		console.log("targetID", targetId);
		console.log("userId", props.user?.userID);
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
			console.log("currenchat", prevChat.chatName);
	
				if( prevChat.chatName === roomName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isMuted: true
					}));
					alert("You have been muted.");
				}
				return prevChat;
			});
			console.log("currenchat", currentChat.chatName);
		}
	}

	function handleBlockedUserSocket(targetId: number, callerName: string) {
		console.log("targetID", targetId);
		console.log("userId", props.user?.userID);
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
			console.log("currenchat", prevChat.chatName);
	
				if( prevChat.chatName === callerName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isBlocked: true
					}));
					alert("You have been blocked by the User.");
				}
				return prevChat;
			});
			// console.log("currenchat", currentChat.chatName);
		}
	}

	function handleunblockedUserSocket(targetId: number, callerName: string) {
		console.log("targetID", targetId);
		console.log("userId", props.user?.userID);
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
			console.log("currenchat", prevChat.chatName);
	
				if( prevChat.chatName === callerName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isBlocked: false
					}));
					alert("You have been unblocked by the User.");
				}
				return prevChat;
			});
			// console.log("currenchat", currentChat.chatName);
		}
	}

	



	function inviteButton(invitedPlayer: User | undefined){
		if( invitedPlayer) {
			if (!props.invitation.playerOneSocket ||
				 !props.invitation.playerTwoSocket ||
				 !props.invitation.sessionId) {
				props.invitation.playerOneSocket = props.user!.socketId;
				props.invitation.playerTwoSocket = invitedPlayer.socketId;
			}
			props.invitePlayer(props.invitation);
		}
		else 
			alert("Error while inviting Player. Please try again");
	}

	const renderChatInput = (chatInputProps: chatInputProps) => {
		return (
		  <ChatInput_Div {...chatInputProps} />
		);
	  };

	const handleBody = useCallback (() =>{
		setBody(<ChatBody_Div
			props = {props}
			messages={messages[currentChat.chatName]}
			joinRoom={joinRoom}
			ChannelUserRoles={currentRoles}
			currentChat={currentChat}
			joinPrivateRoom={joinPrivateRoom}
		/>);
	}, [messages, currentRoles]);

	const openFriend = (userName: string) => {
		getUserIDByUserName(userName)
		.then(result => {
			if (result !== undefined) {
				props.friend_set(result);
				// props.mode_set(main_div_mode_t.PUBLIC_PROFILE);
			}
		}).catch(error => {
			console.error("Error retrieving UserID:", error);
		})
	  };
	
	const handleChannelPanel = useCallback(() =>{
		setChannelpanel(
			loadingChannelpanel ? (
			  <div>Loading Channel Name...</div> // Show a loading spinner or placeholder
			) : (
			  <ChannelInfo>
				{currentChat.chatName}
				{/* <button onClick={() => props.leaveRoom(props.currentChat.chatName)}>
						Leave {props.currentChat.chatName}
					</button> */}
			  </ChannelInfo>
			)
		  );
		if (!currentChat.isChannel){
			setChannelpanel(
				loadingChannelpanel ? (
				  <div>Loading Channel Name...</div> // Show a loading spinner or placeholder
				) : (
				  <ChannelInfo>

					<div onClick={() => openFriend(currentChat.chatName.toString())}>
    					{currentChat.chatName}
  					</div>
					<div>
					<button onClick={() => inviteButton(props.allUsers.find(user => user.username === currentChat.chatName))}>
						Invite for a Game
					</button>
					<button onClick={() => props.addBlockedUser(currentChat.chatName)}>
						Block User
					</button>
					<button onClick={() => props.unblockUser(currentChat.chatName)}>
						Unblock User
					</button>
					<button onClick={() => props.addFriend(currentChat.chatName)}>
						Add as Friend
					</button>
					<button onClick={() => props.removeFriend(currentChat.chatName)}>
						Remove Friend
					</button>
					</div>
				  </ChannelInfo>
				)
			);
		}
		else if (currentRoles.isBlocked || currentRoles.isMuted) {
			setChannelpanel(
				loadingChannelpanel ? (
				  <div>Loading Channel Name...</div> // Show a loading spinner or placeholder
				) : (
				  <ChannelInfo>
					{currentChat.chatName}
					{/* <button onClick={() => props.leaveRoom(props.currentChat.chatName)}>
							Leave {props.currentChat.chatName}
						</button> */}
				  </ChannelInfo>
				)
			);
		}
		else if (currentRoles.isOwner){
			  setChannelpanel(
				  <ChannelOwner_Buttons_Div{...props} loadingChannelPanel={loadingChannelpanel}/>
			  );
		  }
		else if (currentRoles.isAdmin && currentRoles.isAdminResolved) {
			setChannelpanel(
				<ChannelAdmin_Buttons_Div{...props} loadingChannelPanel={loadingChannelpanel}/>
			);
		} 
		setChannelPanelLoaded(true);
	}, [
		currentRoles, 
		currentChat,
		loadingChannelpanel,
	]);

	useEffect(() => {
		setLoadingChannelpanel(false);
	}, [currentChat, currentChat.isResolved, messages]);

	useEffect(() => {
		if (channelPanelLoaded) {
		  setLoadingChannelpanel(false);
		}
	}, [channelPanelLoaded]);


	// useEffect(() => {
	// 	setChatInput(<ChatInput_Div props = {props}/>);
	// }, [props.currentChat, handleBody, handleChannelPanel, loadingChannelpanel, props.ChannelUserRoles, messages]);
	
	useEffect(() => {
		handleChannelPanel();
		handleBody();
		// setChatInput(<ChatInput_Div props = {props}/>);
	}, [currentChat, handleBody, handleChannelPanel, loadingChannelpanel, currentRoles]);

	return (
		<div style={ChatContainerStyle}>
			<SideBar>
				<Channel_Div 
				ChatProps={props} 
				allChannels={allChannels} 
				toggleChat={toggleChat}
				updateChannellist={updateChannellist}/>
				<h3>All Users</h3>
				{props.allUsers.map((user) => renderUser(user, props, toggleChat))}
			</SideBar>
			<ChatPanel>
				<ChannelInfo>
					{channelpanel}
				</ChannelInfo>
				<BodyContainer>
				{body}
				</BodyContainer>
				{/* {chatInput}
				<TextBox
				value={props.message}
				onChange={props.handleMessageChange}
				onKeyPress={handleKeyPress}
				placeholder="You can write something here"
				/> */}
				{/* </BodyContainer> */}
				{renderChatInput({
					props: props,
					value: message,
					onChange: handleMessageChange,
					onKeyPress: handleKeyPress,
					ChannelUserRoles: currentRoles,
					currentChat: currentChat
				})}
			</ChatPanel>
		</div>
	);
};

export default Chat_MainDiv;