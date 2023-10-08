import React, { FC, useEffect, useState, useCallback} from "react";
import { extractExcludedSenders, renderUser} from "../div/ChatUtils"; 
import {ChatContainerStyle, BodyContainer, ChannelInfo, ChatPanel, SideBarStyle, chatButtonsStyle, linkTextStyle, userButtonStyle } from "./ChatPageStyles";
import ChannelDiv from '../div/ChannelDiv';
import { ChannelAdminButtonsDiv, ChatBodyDivChannelOwnerButtonsDiv } from "../div/ChannelButtonsDiv";
import ChatBodyDiv from "../div/ChannelChatBodyDiv";
import ChannelInputDiv from "../div/ChannelChatPanelDiv";
import { Channel, ChannelUserRoles, ChatName, ChatProps } from "../../interfaces/Channel";
import { fetchAllChannels, getUserIDByUserName } from "../div/ChannelUtils";
import { User } from "../../interfaces/User";
import { deleteBlockedUser, deleteChannelUser, getBlockedUser, getChannelBlockedUser, getChannelUser, getMutedStatus, postBlockedUser, postChannelUser, postPrivateChannelUser } from "../../api/channel/channel_user.api";
import { CurrentChat, WritableDraft, getChannelFromChannellist, initialMessagesState, initializeMessagesState } from "./Arena_Chat";
import immer from "immer";
import { getIsAdmin, postAdmin } from "../../api/channel/channel_admin.api";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../Popups/ErrorPopup";

const ChatMainDiv: FC<ChatProps> = (props) => {
	const navigate = useNavigate();
	const [body, setBody] = useState<JSX.Element | null>(null);
	const [channelpanel, setChannelpanel] = useState<JSX.Element | null>(null);
	const [loadingChannelpanel, setLoadingChannelpanel] = useState(true);
	const [channelPanelLoaded, setChannelPanelLoaded] = useState(false);
	const [allChannels, setAllChannels] = useState<any[]>([]);

	const [error, setError] = useState<string | null>(null);

	const [currentChat, setCurrentChat] = useState<CurrentChat>({
		isChannel: true,
		chatName: "general",
		chatId: undefined,
		receiverId: "",
		senderId: undefined,
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
		chatId: undefined,
		receiverId: "",
		senderId: undefined,
		isResolved: true,
		Channel: {
			ChannelId: 41,
			OwnerId: 1,
			Name: 'general',
			Type: "public",
			Password: ""
		} as Channel,
	});

	useEffect(() => {
		try {
			fetchAllChannels()
				.then((channels) => {
					setAllChannels(channels);
					const currentChannel = getChannelFromChannellist(channels, "general");
					if (currentChannel) {
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
				});
		} catch(error) {
		}
	}, []);

	function updateChannellist(){
		fetchAllChannels()
		.then((channels) => {
			setAllChannels(channels);
		});
	}

	useEffect(() => {initializeMessagesState();},[]);

	const [messages, setMessages] = useState<{
		[key in ChatName]: { sender: string | undefined; content: string }[];
	}>(initialMessagesState);

	const [message, setMessage] = useState("");

	function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setMessage(e.target.value);
	}
	function sendMessage() {
		const trimmedMessage = message.trim();
		let receiverId = null;

		if (!currentChat.isChannel) {
			const receiverUser = props.allUsers.find(user => user.username === currentChat.chatName);
			if (receiverUser) {
				receiverId = receiverUser.socketId;
			}
		}
		const payload = {
		content: trimmedMessage,
		to: currentChat.chatName,
		sender: props.user?.username,
		chatName: currentChat.chatName,
		isChannel: currentChat.isChannel,
		receiver: receiverId
		};

		props.socketRef.current?.emit("send message", payload);
		const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
			if(!draft[currentChat.chatName]) {
				draft[currentChat.chatName] = [];
			}
			draft[currentChat.chatName].push({
				sender: props.user?.username,
				content: message
			});
		});
		setMessages(newMessages);
		setMessage("");
	}

	function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter") {
		sendMessage();
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
  const asyncFunctions = [];

  if (currentChat.isChannel) {
    asyncFunctions.push(handleUserInChannelCheck());
    asyncFunctions.push(handleUserInChannelBlockedCheck());
    asyncFunctions.push(handleUserInChannelMutedCheck());
    asyncFunctions.push(handleAdminCheck());
    asyncFunctions.push(handleOwnerCheck());
  } else if (!currentChat.isChannel) {
    asyncFunctions.push(handleUserDirektMessageStatus());
  }

  Promise.all(asyncFunctions)
    .then(() => {
      handleBody();
    })
    .catch((error) => {
    });
}, [currentChat.chatName]);



	const handleUserDirektMessageStatus = useCallback (async () => {
		setCurrentRoles((prevState) => ({
			...prevState,
			isBlockedResolved: false
		}));
		if (!currentChat.isResolved){
			return;
		}
		getUserIDByUserName(currentChat.chatId!.toString())
			.then((result) => {
				if(result !== undefined){
					getBlockedUser(props.user?.userID, result, props.user!)
					.then((user) => {
						setCurrentRoles((prevState) => ( {
							...prevState,
							isBlocked: user,
							isBlockedResolved: true
						}));
					}).catch(error => {
						setError("Error while blocking User");
					});
				}
			}).catch(error =>{
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
			getChannelUser(props.user?.userID, currentChat.Channel.ChannelId, props.user?.userID, props.user!)
				.then((user) => {
					setCurrentRoles((prevState) => ( {
						...prevState,
						isUser: !!user,
						isUserResolved: true
					}));
				})
		}catch (error){
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
			getChannelBlockedUser(props.user?.userID, currentChat.Channel.ChannelId, props.user!)
				.then((user) => {
					setCurrentRoles((prevState) => ({
						...prevState,
						isBlocked:	user,
						isBlockedResolved: true
					}));
				})
		}catch (error){}
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
			}
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
					}
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
		} else {
			ownerStatus = false;
		};
		setCurrentRoles((prevState) => ({
			...prevState,
			isOwner:	ownerStatus,
			isOwnerResolved: true
		}));		
	}, [currentChat.isResolved, currentChat.Channel.ChannelId]);

	function joinRoom(chatName: ChatName) {
		postChannelUser(props.user?.userID, currentChat.Channel.ChannelId, props.user!)
			.then(()=> {
			props.socketRef.current?.emit("join room", chatName, (messages: any) => roomJoinCallback(messages, chatName))
			setCurrentRoles((prevState) => ({
				...prevState,
				isUser: true
			}))
			}).catch(error => {
			});
	}

	function leaveRoom(chatName: ChatName) {
		deleteChannelUser(props.user?.userID, props.user?.userID, currentChat.Channel.ChannelId, props.user!)
			.then((response)=> {
			setCurrentRoles((prevState) => ({
				...prevState,
				isUser: false
			}))
			}).catch(error => {
			});
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


	function joinPrivateRoom(chatName: ChatName, password: string) {
		postPrivateChannelUser(props.user?.userID, currentChat.Channel.ChannelId, password, props.user!)
		.then(() => {
				props.socketRef.current?.emit("join room", chatName, (messages: any) => roomJoinCallback(messages, chatName));
				setCurrentRoles((prevState) => ({
					...prevState,
					isUser: true
				}));
			})
			.catch(error => {
				setError("Wrong Password. Pleayse try again");
			});
	}

	function handleDeletingChatRoom(roomName: string | number){
		updateChannellist();
		setCurrentChat((prevChat) => {
			if (prevChat.chatName === roomName) {
				setError("The Chat has been deleted by the Owner.");
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
		});
		
		setMessages(newMessages);
		}
		setCurrentChat(newCurrentChat);
	}

	function addAdminRights(newAdminUsername: string, roomName: string | number){
		getUserIDByUserName(newAdminUsername)
			.then((targetID) => {
				if(targetID === undefined){
					setError("User could not be found. Please try another Username.");
					return;
				}
				postAdmin(currentChat.Channel.ChannelId, Number(targetID), props.user)
				.then(() => {
					const data = {
						newAdminUserID: Number(targetID),
						roomName: roomName
					};
					props.socketRef.current?.emit('add admin', data);
					
				})
				.catch(error => {
					setError("Error while adding User as Admin");
				})
			})
			.catch(error => {
				setError("Error while adding User as Admin");
			});
	}

	function addBlockedUser(targetName: string | number){
		getUserIDByUserName(targetName.toString())
		.then((targetID) => {
			if(targetID === undefined){
				setError("User could not be found. Please try another Username.");
				return;
			}
			postBlockedUser(Number(targetID), props.user!)
			.then((response) => {
				if (response){
					blockUserSocket(Number(targetID), props.user?.username);
					handleBody();	
				}
			})
			.catch(error => {
			})
		})
		.catch(error => {
			setError("Error while blocking User" + error);
		});
	}

	function unblockUser(targetName: string | number){
		getUserIDByUserName(targetName.toString())
			.then((targetID) => {
				if(targetID === undefined){
					setError("User could not be found. Please try another Username.");
					return;
				}
				deleteBlockedUser(Number(targetID), props.user!)
				.then(() => {
					unblockUserSocket(Number(targetID), props.user?.username)
					setTimeout(() => {
						handleBody();
					  }, 1000);
				})
				.catch(error => {
					setError("Error while unblocking User" + error);
				})
			})
			.catch(error => {
				setError("Error while unblocking User" + error);
			});
	}


	function handleAdminRights(newAdminUserID: number, roomName: string) {
		if (newAdminUserID === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
				if( prevChat.chatName === roomName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isAdmin: true
					}));
				}
				return prevChat;
			});
		}
	}

	function handleBannedUserSocket(targetId: number, roomName: string) {
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
				if( prevChat.chatName === roomName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isBlocked: true
					}));
				}
				return prevChat;
			});
		}
	}

	function handleUnbannedUserSocket(targetId: number, roomName: string) {
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {

				if( prevChat.chatName === roomName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isBlocked: false
					}));
				}
				return prevChat;
			});
		}
	}

	function handleUnmutedUserSocket(targetId: number, roomName: string) {
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
				if( prevChat.chatName === roomName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isMuted: false
					}));
				}
				return prevChat;
			});
		}
	}
	
	function handleMutedUserSocket(targetId: number, roomName: string) {
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
				if( prevChat.chatName === roomName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isMuted: true
					}));
				}
				return prevChat;
			});
		}
	}

	function handleBlockedUserSocket(targetId: number, callerName: string) {
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
				if( prevChat.chatId === callerName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isBlocked: true
					}));
				}
				return prevChat;
			});
		}
	}

	function handleunblockedUserSocket(targetId: number, callerName: string) {
		if (targetId === props.user?.userID)
		{
			setCurrentChat((prevChat) => {
				if( prevChat.chatId === callerName){
					setCurrentRoles((prevRoles) => ({
						...prevRoles,
						isBlocked: false
					}));
				}
				return prevChat;
			});
		}
	}

	
	function inviteButton(invitedPlayer: User | undefined){
		if( invitedPlayer) {
			if (!props.invitation.playerOneSocket ||
				 !props.invitation.playerTwoSocket ||
				 !props.invitation.sessionId) {
				const userOne = props.allUsers.find(user => user.username === props.user?.username)
				props.invitation.playerOneSocket = userOne!.socketId;
				props.invitation.playerTwoSocket = invitedPlayer.socketId;
			}
			props.invitePlayer(props.invitation);
		}
		else 
			setError("Error while inviting Player. Please try again");
	}

	const handleBody = useCallback (() =>{
		let excludedSenders: string[] = [];
		extractExcludedSenders(props.user!)
			.then((excluded) => {
				excludedSenders = excluded;
				setBody(<ChatBodyDiv
					props = {props}
					messages={messages[currentChat.chatName]}
					joinRoom={joinRoom}
					ChannelUserRoles={currentRoles}
					currentChat={currentChat}
					joinPrivateRoom={joinPrivateRoom}
					excludedSenders={excludedSenders}
				/>);
			  })
			  .catch((error) => {
			  });
	}, [messages, currentRoles, currentChat]);

	const openFriend = async (userName: string) => {
		const userID = await getUserIDByUserName(userName);
	  
		if (userID !== undefined) {
			navigate(`/app/public_profile/${userID}`);		}
	  };
	
	const handleChannelPanel = useCallback(() =>{
		setChannelpanel(
			loadingChannelpanel ? (
			  <div>Loading Channel Name...</div>
			) : (
				currentRoles.isUserResolved ? (
			  <ChannelInfo>
				<h3>{currentChat.chatName}</h3>
				{currentRoles.isUser && currentChat.chatName !== "general" && (
					<button
					style={chatButtonsStyle}
					onClick={() => leaveRoom(currentChat.chatName)}
					>
					Leave {currentChat.chatName}
					</button>
				)}
			  </ChannelInfo>
				) : (
					<div>Loading Channel Name...</div>
				)
			)
		  );

		if (!currentChat.isChannel){
			setChannelpanel(
				loadingChannelpanel ? (
				  <div>Loading Channel Name...</div> 
				) : (
				  <ChannelInfo>
					<div style={linkTextStyle}>
						<h3 style={{ marginBottom: '10px' }}>Private DM with:</h3>
						<button
						style={userButtonStyle}
						onClick={() => {
						openFriend(currentChat.chatId!.toString())
						}}
						>
						{currentChat.chatId!.toString()}
						</button>
					</div>

					<div>
						<button 
						style={chatButtonsStyle}
						onClick={() => inviteButton(props.allUsers.find(user => user.username === currentChat.chatId))}>
							Invite for/ Accept a Game
						</button>
					</div>
				  </ChannelInfo>
				)
			);
		}
		else if (currentRoles.isBlocked || currentRoles.isMuted) {
			setChannelpanel(
				loadingChannelpanel ? (
				  <div>Loading Channel Name...</div>
				) : (
				  <ChannelInfo>
					{currentChat.chatName}
					{currentRoles.isUser && (
						<div>
							<button
							style={chatButtonsStyle}
							onClick={() => leaveRoom(currentChat.chatName)}
							>
							Leave {currentChat.chatName}
							</button>
						</div>
						)}
				  </ChannelInfo>
				)
			);
		}
		else if (currentRoles.isOwner){
			  setChannelpanel(
				  <ChatBodyDivChannelOwnerButtonsDiv 
				  	chatProps={props} 
					loadingChannelPanel={loadingChannelpanel} 
					currentChat={currentChat}
					updateChannellist={updateChannellist}
					addAdminRights={addAdminRights}
					toggleChat={toggleChat}
					generalChat={generalChat} 
					changeChatRoom={changeChatRoom}
					banUserSocket={banUserSocket}
					unbanUserSocket={unbanUserSocket}
					muteUserSocket={muteUserSocket}
					deleteChatRoom={deleteChatRoom}
					leaveRoom = {leaveRoom}/>
			  );
		  }
		else if (currentRoles.isAdmin && currentRoles.isAdminResolved && currentRoles.isUser && currentRoles.isUserResolved) {
			setChannelpanel(
				<ChannelAdminButtonsDiv
				chatProps={props} 
				loadingChannelPanel={loadingChannelpanel} 
				currentChat={currentChat}
				updateChannellist={updateChannellist}
				addAdminRights={addAdminRights}
				toggleChat={toggleChat}
				generalChat={generalChat}
				changeChatRoom={changeChatRoom}
				banUserSocket={banUserSocket}
				unbanUserSocket={unbanUserSocket}
				muteUserSocket={muteUserSocket}
				deleteChatRoom={deleteChatRoom}
				leaveRoom = {leaveRoom}/>
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

	function blockUserSocket(targetId: string | number, username: string | undefined) {
		props.socketRef.current?.emit('block user', {targetId, username});
	}

	function unblockUserSocket(targetId: string | number, username: string | undefined) {
		props.socketRef.current?.emit('unblock user', {targetId, username});
	}

	function deleteChatRoom(roomName: string | number) {
		props.socketRef.current?.emit('delete room', roomName);
	}


	function addChatRoom(roomName: string | number) {
		props.socketRef.current?.emit('add room', roomName);
	}

	function changeChatRoom(roomName: string | number) {
		props.socketRef.current?.emit('change room', roomName);
	}

	function banUserSocket(targetId: number, roomName: string | number) {
		props.socketRef.current?.emit('ban user', {targetId, roomName});
	}

	function unbanUserSocket(targetId: number, roomName: string | number) {
		props.socketRef.current?.emit('unban user', {targetId, roomName});
	}

	function muteUserSocket(targetId: number, roomName: string | number, muteDuration: number) {
		props.socketRef.current?.emit('mute user', {targetId, roomName, muteDuration});
	}

	useEffect(() => {
		handleChannelPanel();
		handleBody();
	}, [currentChat, handleBody, handleChannelPanel, loadingChannelpanel, currentRoles]);

	return (
		<div style={ChatContainerStyle}>
			<div style={SideBarStyle}>
				<ChannelDiv 
				ChatProps={props} 
				allChannels={allChannels} 
				toggleChat={toggleChat}
				updateChannellist={updateChannellist}
				addChatRoom={addChatRoom}
				currentChat={currentChat}
				joinPrivateRoom={joinPrivateRoom}/>
				<div key="users">
					<h3>All Users</h3>
					{props.allUsers.map((user) => (
						<div key={user.username}>
							{renderUser(user, props, toggleChat)}
						</div>
						))}
				</div>
			</div>
			<ChatPanel key="channelpanel">
				<ChannelInfo key="channelInfo">
					{channelpanel}
				</ChannelInfo>
				<BodyContainer key="bodycontainer">
				{body}
				</BodyContainer>
				<ChannelInputDiv key="channelinputdiv"
					props={props}
					value={message}
					onChange={handleMessageChange}
					onKeyPress={handleKeyPress}
					currentRoles={currentRoles}
					currentChat={currentChat}
				/>
			</ChatPanel>
			<ErrorPopup message={error} onClose={() => setError(null)} />
		</div>
	);
};

export default ChatMainDiv;