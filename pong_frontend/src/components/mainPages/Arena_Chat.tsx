import React, { useState, useRef, useEffect, useCallback } from 'react';
import Form from "./UsernameForm";
import Chat_MainDiv from "./Chat_MainDiv";
import Game from './Game';
import GameForm from "./GameForm";
import { io, Socket } from "socket.io-client";
import immer, { Draft } from "immer";
import "../../App.css";
import {fetchChannelNames, copyChannelByName, fetchAllChannels, getUserIDByUserName} from "../div/channel_utils"
import {postChannelUser, deleteChannelUser, getChannelUser, getChannelBlockedUser, getIsMuted, postPrivateChannelUser, getMutedStatus, postBlockedUser, getBlockedUser, deleteBlockedUser, postFriend, deleteFriend, getIsFriend} from "../../api/channel/channel_user.api"
import { Channel, ChannelUserRoles, ChatProps } from '../../interfaces/channel.interface';
import { User } from '../../interfaces/user.interface';
import { useUserContext } from '../context/UserContext';
import { connected } from 'process';
import { getIsAdmin, postAdmin } from '../../api/channel/channel_admin.api';
import { error } from 'console';
import { GameContainerStyle } from './GamePageStyles';
import { ArenaStyle, ChatContainerStyle } from './ChatPageStyles';
// import { main_div_mode_t } from '../MainDivSelector';
// import { Channel } from 'diagnostics_channel';

interface ArenaDivProps
{
  userID: number | undefined;
//   mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

interface Invitation {
	sessionId: any | null;
	playerOneSocket: string | null;
	playerTwoSocket: string | null;
};

export type WritableDraft<T> = Draft<T>;



export let initialMessagesState: {
	[key: string]: { sender: string; content: string }[];
} = {};

//Using fetched Channel Names to add as keys to the initialMessageState object
export async function initializeMessagesState() {
	const channelNames = await fetchChannelNames();
	channelNames.forEach((channelName) => {
		initialMessagesState[channelName] = [];
	});
}

//returning Channelofject from Channellist with same Name
export function getChannelFromChannellist(channelList: Channel[], channelName: string | number): Channel | undefined {
	return channelList.find((channel) => channel.Name === channelName);
}

export type ChatName = keyof typeof initialMessagesState;

export type CurrentChat = {
	isChannel: boolean;
	chatName: ChatName;
	receiverId: string | number;
	isResolved: boolean;
	Channel: Channel;
};

const Arena_Chat_MainDiv: React.FC<ArenaDivProps> = ({userID, friend_set}) => {
	const { user } = useUserContext()
	/* chat utilities */
	const [username, setUsername] = useState("");
	const [connected, setConnected] = useState(true);
	const [connectedRooms, setConnectedRooms] = useState<string[]>(["general"]);
	const [allUsers, setAllUsers] = useState<any[]>([]);

	
	// useEffect(() => {
	// 	const intervalID = setInterval(() => {
	// 		fetchAllChannels()
	// 			.then((channels) => {
	// 				setAllChannels(channels);
	// 			})
	// 			.catch((error) => {
	// 				console.error("Error fetching all Channels: ", error);
	// 			});
	// 	}, 30000);
	// 	return () => clearInterval(intervalID);
	// }, []);

	let [playerOne, setPlayerOne] = useState<string>("");
	let [playerTwo, setPlayerTwo] = useState<string>("");
	let [audience, setAudience] = useState<string>("");

	const socketRef = useRef<Socket | null>(null!);

		function addBlockedUser(targetName: string | number){
			getUserIDByUserName(targetName.toString())
				.then((targetID) => {
					if(targetID === undefined){
						alert("User could not be found. Please try another Username.");
						return;
					}
					postBlockedUser(user?.userID, Number(targetID))
					.then(() => {
						console.log('User blocked with UserId:', targetID);
						// const data = {
						// 	callerId: userID,
						// 	targetId: Number(targetID)
						// };
						// socketRef.current?.emit('block user', data);
						blockUserSocket(Number(targetID), user?.username);
					})
					.catch(error => {
						console.error("Error blocking user with Username:" , targetName);
						alert("Error while blocking User" + error);
					})
				})
				.catch(error => {
					console.error('Error getting UserID from User:' ,error);
					alert("Error while blocking User" + error);
				});
			}

	function unblockUser(targetName: string | number){
		getUserIDByUserName(targetName.toString())
			.then((targetID) => {
				if(targetID === undefined){
					alert("User could not be found. Please try another Username.");
					return;
				}
				deleteBlockedUser(user?.userID, Number(targetID))
				.then(() => {
					console.log('User unblocked with UserId:', targetID);
					unblockUserSocket(Number(targetID), user?.username);
				})
				.catch(error => {
					console.error("Error unblocking user with Username:" , targetName);
					alert("Error while unblocking User" + error);
				})
			})
			.catch(error => {
				console.error('Error getting UserID from User:' ,error);
				alert("Error while unblocking User" + error);
			});
	}
	
	function addFriend(targetName: string | number){
		getUserIDByUserName(targetName.toString())
		.then((targetID) => {
			if(targetID === undefined){
				alert("User could not be found. Please try another Username.");
				return;
			}
			getIsFriend(user?.userID, Number(targetID))
			.then((result) => {
				if (result){
					alert("User is already a Friend");
					return;
				}
				postFriend(Number(targetID), user?.userID)
				.then(() => {
					console.log('Friend added with UserId:', targetID);
					alert("User "+ targetName + " added as Friend");
					// blockUserSocket(Number(targetID), user.username);
				})
				.catch(error => {
					console.error("Error adding user as Friend with Username:" , targetName);
					alert("Error while adding User as Friend:" + error);
				});
			})
			.catch(error => {
				console.error("Error adding user as Friend with Username:" , targetName);
				alert("Error while adding User as Friend:" + error);
			});
		})
		.catch(error => {
			console.error('Error getting UserID from User:' ,error);
			alert("Error adding User as Friend" + error);
		});
	}

	function removeFriend(targetName: string | number){
		getUserIDByUserName(targetName.toString())
		.then((targetID) => {
			if(targetID === undefined){
				alert("User could not be found. Please try another Username.");
				return;
			}
			getIsFriend(user?.userID, Number(targetID))
			.then((result) => {
				if (!result){
					alert("User is not a Friend");
					return;
				}
				deleteFriend(Number(targetID), user?.userID)
				.then(() => {
					console.log('Friend removed with UserId:', targetID);
					alert("User "+ targetName + " removed as Friend");
					// blockUserSocket(Number(targetID), user.username);
				})
				.catch(error => {
					console.error("Error removing user as Friend with Username:" , targetName);
					alert("Error while removing User as Friend:" + error);
				});
			})
			.catch(error => {
				console.error('Error getting Friendship Status from User:' ,error);
				alert("Error getting Friendship Status" + error);
			})
		})
		.catch(error => {
			console.error('Error getting UserID from User:' ,error);
			alert("Error removing User as Friend" + error);
		});
	}

	function deleteChatRoom(roomName: string | number) {
		socketRef.current?.emit('delete room', roomName);
	}


	function addChatRoom(roomName: string | number) {
		socketRef.current?.emit('add room', roomName);
	}

	function changeChatRoom(roomName: string | number) {
		socketRef.current?.emit('change room', roomName);
	}

	function banUserSocket(targetId: number, roomName: string | number) {
		socketRef.current?.emit('ban user', {targetId, roomName});
	}

	function unbanUserSocket(targetId: number, roomName: string | number) {
		socketRef.current?.emit('unban user', {targetId, roomName});
	}

	function muteUserSocket(targetId: number, roomName: string | number, muteDuration: number) {
		socketRef.current?.emit('mute user', {targetId, roomName, muteDuration});
	}

	function blockUserSocket(targetId: string | number, username: string | undefined) {
		socketRef.current?.emit('block user', {targetId, username});
	}

	function unblockUserSocket(targetId: string | number, username: string | undefined) {
		socketRef.current?.emit('unblock user', {targetId, username});
	}

	

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
					getBlockedUser(result, user?.userID)
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
			getChannelUser(user?.userID, currentChat.Channel.ChannelId)
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
			getChannelBlockedUser(user?.userID, currentChat.Channel.ChannelId)
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
			getMutedStatus(currentChat.Channel.ChannelId, user?.userID)
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
			getIsAdmin(currentChat.Channel.ChannelId, user?.userID)
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
		if (currentChat.Channel.OwnerId === userID){
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

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setUsername(e.target.value);
	}

	useEffect(() => {

		function connect() {
			setConnected(true);
			socketRef.current = io("http://localhost:4000", {
			transports: ["websocket"],
			withCredentials: true,
			});
			console.log("What is being sent as username is: " + user?.username);
			const data = {
				username: user?.username,
				userId: user?.userID,
				};
			socketRef.current.emit("join server", data);
			socketRef.current.emit("join room", "general", (messages: any) => roomJoinCallback(messages, "general"));
			socketRef.current.on("new user", (allUsers: any) => {
				setAllUsers(allUsers);
				console.log(allUsers);
			});
			socketRef.current.on("new message", ({ content, sender, chatName }: { content: string; sender: string; chatName: ChatName }) => {
				console.log("sender", sender);
				console.log("chatNAme", chatName);
				console.log("content:", content)
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
			});
			socketRef.current.on('room deleted', (roomName) => {
				handleDeletingChatRoom(roomName);
			});
			socketRef.current.on('room added', (roomName) => {
				updateChannellist();
			});
			socketRef.current.on('room changed', (roomName) => {
				updateChannellist();
			});
			socketRef.current.on('admin added', (data) => {
				const newAdminUserID =data.newAdminUserID;
				const roomName = data.roomName;
				handleAdminRights(newAdminUserID, roomName);
			});
			socketRef.current.on('user banned', (data) => {
				const targetId = data.targetId;
				const roomName = data.roomName;
				handleBannedUserSocket(targetId, roomName);
			});
			socketRef.current.on('user unbanned', (data) => {
				const targetId = data.targetId;
				const roomName = data.roomName;
				handleUnbannedUserSocket(targetId, roomName);
			});
			socketRef.current.on('user muted', (data) => {
				const targetId = data.targetId;
				const roomName = data.roomName;
				handleMutedUserSocket(targetId, roomName);
			});
			// io.emit('user blocked', {userId, targetId });
			socketRef.current.on('user unmuted', (data) => {
				const targetId = data.targetId;
				const roomName = data.roomName;
				handleUnmutedUserSocket(targetId, roomName);
			});
			socketRef.current.on('user blocked', (data) => {
				const targetId = data.targetId;
				const username = data.username;
				handleBlockedUserSocket(targetId, username);
			});
			socketRef.current.on('user unblocked', (data) => {
				const targetId = data.targetId;
				const username = data.username;
				handleunblockedUserSocket(targetId, username);
			});
			socketRef.current.on('invitation alert playertwo', (data) => {
				const sessionId = data.sessionId;
				const playerOneSocket = data.playerOneSocket;
				const playerTwoSocket = data.playerTwoSocket;
				handlePlayerTwoInvite(sessionId, playerOneSocket, playerTwoSocket);
			});
		}
		connect();

		return () => {
			if (socketRef.current)
				socketRef.current.disconnect();
		}
	}, []);


	function handlePlayerTwoInvite(sessionId: string, playerOneSocket: string, playerTwoSocket: string) {
		// getting user name of playerOne
		const playerOneName = allUsers.find(user => user.socketId === playerOneSocket);

		//allerting playerTwo to join the game
		if (playerOneName) {
			alert("You have been invited to a game by User: " + playerOneName 
			+ "please go to your private conversation to join the game via the invite/start button");
		}
	}
	
	function handleBlockedUserSocket(targetId: number, callerName: string) {
		console.log("targetID", targetId);
		console.log("userId", userID);
		if (targetId === userID)
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
		console.log("userId", userID);
		if (targetId === userID)
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

function handleUnmutedUserSocket(targetId: number, roomName: string) {
	console.log("targetID", targetId);
	console.log("userId", userID);
	if (targetId === userID)
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
	console.log("userId", userID);
	if (targetId === userID)
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

	function handleBannedUserSocket(targetId: number, roomName: string) {
		console.log("targetID", targetId);
		console.log("userId", userID);
		if (targetId === userID)
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
		console.log("userId", userID);
		if (targetId === userID)
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
	function handleAdminRights(newAdminUserID: number, roomName: string) {
		if (newAdminUserID === userID)
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


		/* game utilities */
		const canvasRef = useRef<HTMLCanvasElement | null>(null);
		const [gameStatus, setGameStatus] = useState(0); // Initial game status is 0
		const [isGameStarting, setIsGameStarting] = useState(false);
	
		let [gameSession, setGameSession] = useState<{
			sessionId: string | null;
			player: number | null;
			playerOne: string | null;
			playerTwo: string | null;
		}>({
			sessionId: null,
			player: null,
			playerOne: null,
			playerTwo: null,
		});
		
		let invitation: Invitation | null = {
			sessionId: null,
			playerOneSocket: null,
			playerTwoSocket: null,
		};

		type RegisterHandler = () => void;

		function invitePlayer(invitationNew: Invitation) {
			if (invitation?.sessionId === null) {
				invitation.playerOneSocket = invitationNew?.playerOneSocket;
				invitation.playerTwoSocket = invitationNew?.playerTwoSocket;
			}
			if (socketRef.current?.id && !gameSession.playerOne && !gameSession.playerTwo) {
				console.log("Invite player " + invitation!.playerTwoSocket + " action triggered");
				//console.log("Joining que emitting from Arena Chat, socketRef is: " + socketRef.current.id);
				alert("Invite/Accept To Game Session");
				socketRef.current.emit('invite player', invitation);
			}
			else if (socketRef.current?.id && gameSession.playerOne && !gameSession.playerTwo) {
				alert("You are already in a queue as Player 1.");
			}
			else if (socketRef.current?.id && gameSession.playerOne && gameSession.playerTwo) {
				alert("You are in a session with two players, Player 1 can start the game.");
			}
		}


		function joinQueue(event: React.FormEvent) {
			event.preventDefault(); // Prevent the default form submission behavior
	
			if (socketRef.current?.id && !gameSession.playerOne && !gameSession.playerTwo) {
				console.log("Joining que emitting from Arena Chat, socketRef is: " + socketRef.current.id);
				alert("Joining Sessions Queue");
				socketRef.current.emit('join queue');
			}
			else if (socketRef.current?.id && gameSession.playerOne && !gameSession.playerTwo) {
				alert("You are already in the que as Player 1. Wait for Player 2.");
			}
			else if (socketRef.current?.id && gameSession.playerOne && gameSession.playerTwo) {
				alert("Both players have joined your session, Player 1 can start the game.");
			}
		}


	
		socketRef.current?.on('session joined', ({ sessionIdInput, playerInput }) => {
			console.log("reached Session Joined");
			if (playerInput === 1) {
				setGameSession((prevSession) => ({
					...prevSession,
					sessionId: sessionIdInput,
					player: playerInput,
					playerOne: socketRef.current?.id || '',
				}));
				console.log("Player 1 set");
				alert("Joined a Session as Player 1");
			} else if (playerInput === 2) {
				setGameSession((prevSession) => ({
					...prevSession,
					sessionId: sessionIdInput,
					player: playerInput,
					playerTwo: socketRef.current?.id || '',
				}));
				console.log("Player 2 set");
				alert("Joined a session as Player 2");
			}
		});

		socketRef.current?.on('opponent joined', (opponentSocketId: string) => {
			console.log('Opponent joined with socketId:', opponentSocketId);
		
			// If player 2, save its socket ID for player 1 and vice versa
			if (gameSession.player === 2) {
				gameSession.playerOne = opponentSocketId;
			}
			if (gameSession.player === 1) {
				gameSession.playerTwo = opponentSocketId;
				alert("Player 2 joined your session");
			}
		});

		socketRef.current?.on('clean queue', cleanQueue);

		function cleanQueue() {
			gameSession.playerOne = null;
			gameSession.playerTwo = null;
			gameSession.sessionId = null;
			gameSession.player = null;
			if (invitation) {
				invitation.playerOneSocket = null;
				invitation.playerTwoSocket = null;
				invitation.sessionId = null;
			}
			alert("Left session/queue. You can join a new queue or invite someone to play.");
		};
	
		let updateGameStatus = (newStatus:number) => {
			setGameStatus(newStatus);
		};
	
		function startGame(event: React.FormEvent) {
			console.log("Reached startGame, data is - playerOne: " + gameSession.playerOne + " and playerTwo: " + gameSession.playerTwo);
			// Check if both player 1 and player 2 are assigned
			if (gameSession.playerOne && gameSession.playerTwo) {
				// Check if the current browser is player 1
				if (socketRef.current?.id === gameSession.playerOne) {
					// Emit an event to the server to start the game
					socketRef.current?.emit('start game', gameSession.sessionId);
				} else {
					// Display message for player 2 if they try to start the game
					alert("Please wait for Player One to start the game.");
				}
			}
		}

		function quitGame(event: React.FormEvent) {
			console.log("Reached quitGame, data is - playerOne: " + gameSession.playerOne + " and playerTwo: " + gameSession.playerTwo);
			// Check if both player 1 and/or player 2 are assigned
			if (gameSession.playerOne || gameSession.playerTwo || invitation?.sessionId) {
				if ((socketRef.current?.id === gameSession.playerOne || socketRef.current?.id === gameSession.playerTwo) && gameStatus === 0) {
					socketRef.current?.emit('quit queue', gameSession.sessionId);
				}
				if ((socketRef.current?.id === gameSession.playerOne || socketRef.current?.id === gameSession.playerTwo) && gameStatus === 1) {
					socketRef.current?.emit('quit game', gameSession.sessionId);
				}
				if (invitation?.sessionId != null) {
					alert("Cancelling active invitation");
					socketRef.current?.emit('remove invite', invitation);
					if (invitation.sessionId) {
						invitation.playerOneSocket = null;
						invitation.playerTwoSocket = null;
						invitation.sessionId = null;
					}
				}
			}
			else {
				alert("Nothing to quit");
			}
		}
	
		socketRef.current?.on('waiting for opponent', () => {
			console.log('Waiting for opponent...');
		});
		
		socketRef.current?.on('invalid session', () => {
			console.log('Invalid session. Unable to start the game.');
		});
	
		// Game Starting Listener
			socketRef.current?.on('game starting', () => {
				setGameStatus(1);
				setIsGameStarting(true); // Set isGameStarting to true immediately
				if (invitation != null) {
					invitation.playerOneSocket = null;
					invitation.playerTwoSocket = null;
					invitation.sessionId = null;
				}
			});
		
		function handleGameChange(e: React.ChangeEvent<HTMLInputElement>) {
		 //does nothing
		}
	

	/* rendering condition */
	let body;
	// if (connected) {
		// console.log("before body:", currentChat);
		body = (
		<Chat_MainDiv
			user={user}
			userID={userID}
			// message={message}
			// handleMessageChange={handleMessageChange}
			// sendMessage={sendMessage}
			yourId={socketRef.current ? socketRef.current.id : ""}
			allUsers={allUsers}
			allChannels={allChannels}
			updateChannellist={updateChannellist}
			generalChat={generalChat}
			// joinRoom={joinRoom}
			joinPrivateRoom={joinPrivateRoom}
			changeChatRoom={changeChatRoom}
			leaveRoom={leaveRoom}
			deleteChatRoom={deleteChatRoom}
			addChatRoom={addChatRoom}
			addBlockedUser={addBlockedUser}
			addFriend={addFriend}
			removeFriend={removeFriend}
			unblockUser={unblockUser}
			connectedRooms={connectedRooms}
			currentChat={currentChat}
			// messages={messages[currentChat.chatName]}
			toggleChat={toggleChat}
			// ChannelUserRoles={currentRoles}
			handleAdminCheck={handleAdminCheck}
			addAdminRights={addAdminRights}
			banUserSocket={banUserSocket}
			unbanUserSocket={unbanUserSocket}
			muteUserSocket={muteUserSocket}
			loadingChannelPanel = {false}
			invitePlayer={invitePlayer}
			// mode_set={mode_set}
			friend_set={friend_set}
			invitation={invitation}
			socketRef={socketRef}
		/>
		);
	// } else {
	// 	body = (
	// 	<Form
	// 		username={username}
	// 		onChange={handleChange}
	// 		connect={connect}
	// 	/>
	// 	);
	// }

	let gameBody, gameBodyForm;
	if (gameStatus === 1) {
		if (isGameStarting) {
			console.log("Game data is: \nCurrent socket: " + socketRef.current?.id + "\ngameStatus: " + gameStatus + "\ngameSession: " + JSON.stringify(gameSession) + "\ncanvasRef: " + JSON.stringify(canvasRef) );
			gameBody = (
			<Game
				canvasRef={canvasRef}
				socket={socketRef.current}
				updateGameStatus={updateGameStatus}
				gameSession={gameSession}
				setGameSession={setGameSession}
			/>
			);
		}
	} 
	else {
		gameBody = <canvas width={600} height={300} style={{ backgroundColor: 'black' }} />;
	}

	gameBodyForm = (
		<GameForm
			joinQueue={joinQueue as RegisterHandler}
			startGame={startGame as RegisterHandler}
			quitGame={quitGame as RegisterHandler}
			gameSession={gameSession}
			isConnected={connected}
		/>
	);

	return (
		<div
		style={ArenaStyle}>
			<div>
				{body}
			</div>
			<div
			style={GameContainerStyle}>
				{gameBody}
				{gameBodyForm}
			</div>
		</div>
	);
}

export default Arena_Chat_MainDiv;