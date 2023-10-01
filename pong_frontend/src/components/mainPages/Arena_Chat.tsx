import React, { useState, useRef, useEffect } from 'react';
import ChatMainDiv from "./ChatMainDiv";
import Game from './Game';
import GameForm from "./GameForm";
import { io, Socket } from "socket.io-client";
import { Draft } from "immer";
import "../../App.css";
import {fetchChannelNames} from "../div/channel_utils"
import { Channel } from '../../interfaces/channel.interface';
import { useUserContext } from '../context/UserContext';
import { GameContainerStyle } from './GamePageStyles';
import { ArenaStyle } from './ChatPageStyles';
import { postUserStatus } from '../../api/statusUpdateAPI.api';
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

const ArenaChat: React.FC<ArenaDivProps> = ({userID, friend_set}) => {
	const { user } = useUserContext()
	/* chat utilities */
	// const [username, setUsername] = useState("");
	const [connected, setConnected] = useState(true);
	// let allUsersRef = useRef<any[]>([]);
	const [allUsers, setAllUsers] = useState<any[]>([]);
	let chatMainDivRef = useRef<{ 
		roomJoinCallback: any;
		newMessages: any;
		handleDeletingChatRoom: any;
		updateChannellist:any;
		handleAdminRights: any;
		handleBannedUserSocket: any;
		handleUnbannedUserSocket: any;
		handleMutedUserSocket: any;
		handleUnmutedUserSocket: any;
		handleBlockedUserSocket: any;
		handleunblockedUserSocket: any;
	} | null>(null);

/* 	let [playerOne, setPlayerOne] = useState<string>("");
	let [playerTwo, setPlayerTwo] = useState<string>("");
	let [audience, setAudience] = useState<string>(""); */

	const socketRef = useRef<Socket | null>(null!);
	
	// function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
	// 	setUsername(e.target.value);
	// }



	useEffect(() => {
		const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
		function connect() {
			setConnected(true);
			socketRef.current = io(baseUrl, {
			transports: ["websocket"],
			withCredentials: true,
			});
			console.log("What is being sent as username is: " + user?.username);
			const data = {
				username: user?.username,
				userId: user?.userID,
				};
			socketRef.current.emit("join server", data);
			if (chatMainDivRef.current?.roomJoinCallback){
				socketRef.current.emit("join room", "general", (messages: any) => chatMainDivRef.current?.roomJoinCallback(messages, "general"));
			}
			socketRef.current.on("new user", (allUsers: any) => {
				// allUsersRef.current = allUsers;
				setAllUsers(allUsers);
				console.log(allUsers);
			});
			socketRef.current.on("new message", ({ content, sender, chatName}: { content: string; sender: string; chatName: ChatName ;}) => {
				console.log("sender", sender);
				console.log("chatNAme", chatName);
				console.log("content:", content)
				if (chatMainDivRef.current?.newMessages)
					chatMainDivRef.current.newMessages(content, sender, chatName);
			});
			socketRef.current.on('room deleted', (roomName) => {
				if(chatMainDivRef.current?.handleDeletingChatRoom)
					chatMainDivRef.current.handleDeletingChatRoom(roomName);
			});
			socketRef.current.on('room added', (roomName) => {
				if(chatMainDivRef.current?.updateChannellist)
					chatMainDivRef.current.updateChannellist();
			});
			socketRef.current.on('room changed', (roomName) => {
				if(chatMainDivRef.current?.updateChannellist)
					chatMainDivRef.current.updateChannellist();
			});
			socketRef.current.on('admin added', (data) => {
				const newAdminUserID =data.newAdminUserID;
				const roomName = data.roomName;
				if(chatMainDivRef.current?.handleAdminRights)
					chatMainDivRef.current.handleAdminRights(newAdminUserID, roomName);
			});
			socketRef.current.on('user banned', (data) => {
				const targetId = data.targetId;
				const roomName = data.roomName;
				if(chatMainDivRef.current?.handleBannedUserSocket)
					chatMainDivRef.current.handleBannedUserSocket(targetId, roomName);
			});
			socketRef.current.on('user unbanned', (data) => {
				const targetId = data.targetId;
				const roomName = data.roomName;
				if(chatMainDivRef.current?.handleUnbannedUserSocket)
					chatMainDivRef.current.handleUnbannedUserSocket(targetId, roomName);
			});
			socketRef.current.on('user muted', (data) => {
				const targetId = data.targetId;
				const roomName = data.roomName;
				if (chatMainDivRef.current?.handleMutedUserSocket)
					chatMainDivRef.current.handleMutedUserSocket(targetId, roomName);
			});
			// io.emit('user blocked', {userId, targetId });
			socketRef.current.on('user unmuted', (data) => {
				const targetId = data.targetId;
				const roomName = data.roomName;
				if (chatMainDivRef.current?.handleUnmutedUserSocket)
					chatMainDivRef.current.handleUnmutedUserSocket(targetId, roomName);
			});
			socketRef.current.on('user blocked', (data) => {
				const targetId = data.targetId;
				const username = data.username;
				if(chatMainDivRef.current?.handleBlockedUserSocket)
					chatMainDivRef.current.handleBlockedUserSocket(targetId, username);
			});
			socketRef.current.on('user unblocked', (data) => {
				const targetId = data.targetId;
				const username = data.username;
				if(chatMainDivRef.current?.handleunblockedUserSocket)
					chatMainDivRef.current.handleunblockedUserSocket(targetId, username);
			});
			socketRef.current.on('invitation alert playertwo', (data) => {
				console.log("invite angekommen");
				const sessionId = data.invitation.sessionId;
				const playerOneSocket = data.invitation.playerOneSocket;
				const playerTwoSocket = data.invitation.playerTwoSocket;
				// console.log("sessionid", sessionId);
				// console.log("playerowns", playerOneSocket);
				// console.log("playertwoSo", playerTwoSocket);
				const userOneName = data.username;
				handlePlayerTwoInvite(sessionId, playerOneSocket, playerTwoSocket, userOneName);
			});
		}
		connect();

		return () => {
			if (socketRef.current){
				// socketRef.current.off('init', handleInit);
				// socketRef.current.off("new user", (allUsers: any) => {
				// 	// allUsersRef.current = allUsers;
				// 	setAllUsers(allUsers);
				// 	console.log(allUsers);
				// });
				socketRef.current.off("new message", ({ content, sender, chatName }: { content: string; sender: string; chatName: ChatName }) => {
					console.log("sender", sender);
					console.log("chatNAme", chatName);
					console.log("content:", content)
					if (chatMainDivRef.current?.newMessages)
						chatMainDivRef.current.newMessages(content, sender, chatName);
				});
				socketRef.current.off('room deleted', (roomName) => {
					if(chatMainDivRef.current?.handleDeletingChatRoom)
						chatMainDivRef.current.handleDeletingChatRoom(roomName);
				});
				socketRef.current.off('room added', (roomName) => {
					if(chatMainDivRef.current?.updateChannellist)
						chatMainDivRef.current.updateChannellist();
				});
				socketRef.current.off('room changed', (roomName) => {
					if(chatMainDivRef.current?.updateChannellist)
						chatMainDivRef.current.updateChannellist();
				});
				socketRef.current.off('admin added', (data) => {
					const newAdminUserID =data.newAdminUserID;
					const roomName = data.roomName;
					if(chatMainDivRef.current?.handleAdminRights)
						chatMainDivRef.current.handleAdminRights(newAdminUserID, roomName);
				});
				socketRef.current.off('user banned', (data) => {
					const targetId = data.targetId;
					const roomName = data.roomName;
					if(chatMainDivRef.current?.handleBannedUserSocket)
						chatMainDivRef.current.handleBannedUserSocket(targetId, roomName);
				});
				socketRef.current.off('user unbanned', (data) => {
					const targetId = data.targetId;
					const roomName = data.roomName;
					if(chatMainDivRef.current?.handleUnbannedUserSocket)
						chatMainDivRef.current.handleUnbannedUserSocket(targetId, roomName);
				});
				socketRef.current.off('user muted', (data) => {
					const targetId = data.targetId;
					const roomName = data.roomName;
					if (chatMainDivRef.current?.handleMutedUserSocket)
						chatMainDivRef.current.handleMutedUserSocket(targetId, roomName);
				});
				// io.emit('user blocked', {userId, targetId });
				socketRef.current.off('user unmuted', (data) => {
					const targetId = data.targetId;
					const roomName = data.roomName;
					if (chatMainDivRef.current?.handleUnmutedUserSocket)
						chatMainDivRef.current.handleUnmutedUserSocket(targetId, roomName);
				});
				socketRef.current.off('user blocked', (data) => {
					const targetId = data.targetId;
					const username = data.username;
					if(chatMainDivRef.current?.handleBlockedUserSocket)
						chatMainDivRef.current.handleBlockedUserSocket(targetId, username);
				});
				socketRef.current.off('user unblocked', (data) => {
					const targetId = data.targetId;
					const username = data.username;
					if(chatMainDivRef.current?.handleunblockedUserSocket)
						chatMainDivRef.current.handleunblockedUserSocket(targetId, username);
				});
				socketRef.current.off('invitation alert playertwo', (data) => {
					const sessionId = data.invitation.sessionId;
					const playerOneSocket = data.invitation.playerOneSocket;
					const playerTwoSocket = data.invitation.playerTwoSocket;
					const userOneName = data.username;
					handlePlayerTwoInvite(sessionId, playerOneSocket, playerTwoSocket, userOneName);
				});
				socketRef.current.disconnect();

			}


		}
	}, []);


	function handlePlayerTwoInvite(sessionId: string, playerOneSocket: string, playerTwoSocket: string, username: string) {
		invitation.sessionId = sessionId;
		invitation.playerOneSocket = playerOneSocket;
		invitation.playerTwoSocket = playerTwoSocket;
		//allerting playerTwo to join the game
		if (username) {
			alert("You have been invited to a game by User: " + username
			+ " ,please go to your private conversation to join the game via the invite/start button");
		}
		postUserStatus("InGameQueue", user!);
	}

	function invitePlayer(invitationNew: Invitation) {
		console.log("invitationNew", invitationNew);
		if (invitation?.sessionId === null) {
			invitation.playerOneSocket = invitationNew?.playerOneSocket;
			invitation.playerTwoSocket = invitationNew?.playerTwoSocket;
		}
		if (socketRef.current?.id && !gameSession.playerOne && !gameSession.playerTwo) {
			console.log("Invite player " + invitation!.playerTwoSocket + " action triggered");
			//console.log("Joining que emitting from Arena Chat, socketRef is: " + socketRef.current.id);
			alert("Invite/Accept To Game Session");
			postUserStatus("InGameQueue", user!);
			socketRef.current.emit('invite player', invitation, user?.userID, user?.username);
		}
		else if (socketRef.current?.id && gameSession.playerOne && !gameSession.playerTwo) {
			alert("You are already in a queue as Player 1.");
		}
		else if (socketRef.current?.id && gameSession.playerOne && gameSession.playerTwo) {
			alert("You are in a session with two players, Player 1 can start the game.");
		}
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
		
		// eslint-disable-next-line
		let [invitation, setInvitation] = useState<{
			sessionId: any;
			playerOneSocket: any;
			playerTwoSocket: any;
		}>({
			sessionId: null,
			playerOneSocket: null,
			playerTwoSocket: null,
		});

		type RegisterHandler = () => void;



		function joinQueue(event: React.FormEvent) {
			event.preventDefault(); // Prevent the default form submission behavior
	
			if (socketRef.current?.id && !gameSession.playerOne && !gameSession.playerTwo) {
				console.log("Joining que emitting from Arena Chat, socketRef is: " + socketRef.current.id);
				alert("Joining Sessions Queue");
				socketRef.current.emit('join queue', user?.userID);
			}
			else if (socketRef.current?.id && gameSession.playerOne && !gameSession.playerTwo) {
				alert("You are already in the que as Player 1. Wait for Player 2.");
			}
			else if (socketRef.current?.id && gameSession.playerOne && gameSession.playerTwo) {
				alert("Both players have joined your session, Player 1 can start the game.");
			}
		}


		useEffect(() => {
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
					postUserStatus("InGameQueue", user!);
				} else if (playerInput === 2) {
					setGameSession((prevSession) => ({
						...prevSession,
						sessionId: sessionIdInput,
						player: playerInput,
						playerTwo: socketRef.current?.id || '',
					}));
					console.log("Player 2 set");
					alert("Joined a session as Player 2");
					postUserStatus("InGameQueue", user!);
				}
				console.log("Set new gameSession in session joined: " + JSON.stringify(gameSession));
			});
			
				socketRef.current?.on('opponent joined', (opponentSocketId: string) => {
					console.log('Opponent joined with socketId:', opponentSocketId);
					console.log("session is: " + JSON.stringify(gameSession));
					
					// If player 2, save its socket ID for player 1 and vice versa
					if (gameSession.player === 2) {
						//gameSession.playerOne = opponentSocketId;
						setGameSession((prevSession) => ({
							...prevSession,
							playerOne: opponentSocketId,
						}));
					}
					if (gameSession.player === 1) {
						//gameSession.playerTwo = opponentSocketId;
						setGameSession((prevSession) => ({
							...prevSession,
							playerTwo: opponentSocketId,
					}));
					alert("Player 2 joined your session");
				}
			});

			// eslint-disable-next-line
			socketRef.current?.on('clean queue', cleanQueue);

			return () => {
				socketRef.current?.off('session joined');
				socketRef.current?.off('opponent joined');
				socketRef.current?.off('clean queue', cleanQueue);
			};
			// eslint-disable-next-line
		}, [gameSession]);


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
					postUserStatus("Online", user!);
				}
				if ((socketRef.current?.id === gameSession.playerOne || socketRef.current?.id === gameSession.playerTwo) && gameStatus === 1) {
					socketRef.current?.emit('quit game', gameSession.sessionId);
					postUserStatus("Online", user!);
				}
				if (invitation?.sessionId != null) {
					alert("Cancelling active invitation");
					socketRef.current?.emit('remove invite', invitation);
					postUserStatus("Online", user!);
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
	
		/* socketRef.current?.on('waiting for opponent', () => {
			console.log('Waiting for opponent...');
		}); */
		
		/* socketRef.current?.on('invalid session', () => {
			console.log('Invalid session. Unable to start the game.');
		}); */
	
		// Game Starting Listener

			useEffect(() => {
				socketRef.current?.on('game starting', () => {
				setGameStatus(1);
				postUserStatus("inGame", user!);
				setIsGameStarting(true); // Set isGameStarting to true immediately
				console.log("Invitation before change is: " + JSON.stringify(invitation));
				if (invitation != null) {
					invitation.playerOneSocket = null;
					invitation.playerTwoSocket = null;
					invitation.sessionId = null;
					/* setInvitation({
						sessionId: null,
						playerOneSocket: null,
						playerTwoSocket: null,
					}); */
					console.log("Invitation after change is: " + JSON.stringify(invitation));
				}
				});

				return () => {
				socketRef.current?.off('game starting'); // Unsubscribe from the event when the component unmounts
				};
			}, []);
		
		// eslint-disable-next-line
		function handleGameChange(e: React.ChangeEvent<HTMLInputElement>) {
		 //does nothing
		}
	

	// let body;
	// body = (
	// 	<ChatMainDiv
	// 		user={user}
	// 		userID={userID}
	// 		yourId={socketRef.current ? socketRef.current.id : ""}
	// 		allUsers={allUsersRef.current}
	// 		// allUsers={allUsers}
	// 		invitePlayer={invitePlayer}
	// 		friend_set={friend_set}
	// 		invitation={invitation}
	// 		socketRef={socketRef}
	// 		chatMainDivRef={chatMainDivRef}
	// 	/>
	// );

	let gameBody, gameBodyForm;
	if (gameStatus === 1) {
		if (isGameStarting) {
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
			{/* <div>
				{body}
			</div> */}
			<ChatMainDiv
			user={user}
			userID={userID}
			yourId={socketRef.current ? socketRef.current.id : ""}
			// allUsers={allUsersRef.current}
			allUsers={allUsers}
			invitePlayer={invitePlayer}
			friend_set={friend_set}
			invitation={invitation}
			socketRef={socketRef}
			chatMainDivRef={chatMainDivRef}
		/>
			<div
			style={GameContainerStyle}>
				{gameBody}
				{gameBodyForm}
			</div>
		</div>
	);
}

export default ArenaChat;