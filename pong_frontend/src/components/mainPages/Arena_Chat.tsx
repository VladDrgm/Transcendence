import React, { useState, useRef, useEffect } from 'react';
import ChatMainDiv from "./ChatMainDiv";
import Game from './Game';
import GameForm from "./GameForm";
import { io, Socket } from "socket.io-client";
import { Draft } from "immer";
import {fetchChannelNames} from "../div/ChannelUtils"
import { Channel } from '../../interfaces/Channel';
import { useUserContext } from '../context/UserContext';
import { GameContainerStyle } from './GamePageStyles';
import { ArenaStyle } from './ChatPageStyles';
import { postUserStatus } from '../../api/statusUpdateAPI.api';
import ErrorPopup from '../Popups/ErrorPopup';
import { useNavigate } from 'react-router-dom';

interface ArenaDivProps
{
  userID: number | undefined;
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

export async function initializeMessagesState() {
	const channelNames = await fetchChannelNames();
	channelNames.forEach((channelName) => {
		initialMessagesState[channelName] = [];
	});
}

export function getChannelFromChannellist(channelList: Channel[], channelName: string | number): Channel | undefined {
	return channelList.find((channel) => channel.Name === channelName);
}

export type ChatName = keyof typeof initialMessagesState;

export type CurrentChat = {
	isChannel: boolean;
	chatName: ChatName;
	chatId: string | undefined;
	receiverId: string | number;
	senderId: string | undefined; 
	isResolved: boolean;
	Channel: Channel;
};

const ArenaChat: React.FC<ArenaDivProps> = ({userID, friend_set}) => {
	const { user } = useUserContext()
	const [connected, setConnected] = useState(true);
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

	const [error, setError] = useState<string | null>(null);

	const socketRef = useRef<Socket | null>(null!);

	const navigate = useNavigate();
	
	useEffect(() => {
		// Check if the user is logged in when the component mounts
		if (!user) {
	  		navigate('/login'); // Redirect to the login page if not logged in
		}
	}, [navigate]);

	useEffect(() => {
		const baseUrl = process.env.REACT_APP_BASE_URL || '';

		function connect() {
			setConnected(true);
			socketRef.current = io(baseUrl, {
			transports: ["websocket"],
			withCredentials: true,
			});
			const data = {
				username: user?.username,
				userId: user?.userID,
				};
			socketRef.current.on("connect", () => {
				});

			socketRef.current.emit("join server", data);
			if (chatMainDivRef.current?.roomJoinCallback){
				socketRef.current.emit("join room", "general", (messages: any) => chatMainDivRef.current?.roomJoinCallback(messages, "general"));
			}
			socketRef.current.on("new user", (allUsers: any) => {
				setAllUsers(allUsers);
			});
			socketRef.current.on("new message", ({ content, sender, chatName}: { content: string; sender: string; chatName: ChatName ;}) => {
				if (chatMainDivRef.current?.newMessages){
					chatMainDivRef.current.newMessages(content, sender, chatName);
				}
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
				const sessionId = data.invitation.sessionId;
				const playerOneSocket = data.invitation.playerOneSocket;
				const playerTwoSocket = data.invitation.playerTwoSocket;
				const userOneName = data.username;
				handlePlayerTwoInvite(sessionId, playerOneSocket, playerTwoSocket, userOneName);
			});
			
		}
		connect();

		return () => {
			if (socketRef.current){
		socketRef.current.removeAllListeners();
		if (socketRef.current && socketRef.current.connected) {
			socketRef.current.disconnect();
		}
}


		}
	}, []);


	function handlePlayerTwoInvite(sessionId: string, playerOneSocket: string, playerTwoSocket: string, username: string) {
		invitation.sessionId = sessionId;
		invitation.playerOneSocket = playerOneSocket;
		invitation.playerTwoSocket = playerTwoSocket;
		if (username) {
			setError("You have been invited to a game by User: " + username
			+ " ,please go to your private conversation to join the game via the invite/start button");
		}
		postUserStatus("InGameQueue", user!);
	}

	function invitePlayer(invitationNew: Invitation) {
		if (invitation?.sessionId !== null) {
			setError("Already invited");
		}
		if (invitation?.sessionId === null) {
			invitation.playerOneSocket = invitationNew?.playerOneSocket;
			invitation.playerTwoSocket = invitationNew?.playerTwoSocket;
		}
		if (socketRef.current?.id && !gameSession.playerOne && !gameSession.playerTwo) {
			setError("Invite/Accept To Game Session");
			postUserStatus("InGameQueue", user!);
			socketRef.current.emit('invite player', invitation, user?.userID, user?.username);
		}
		else if (socketRef.current?.id && gameSession.playerOne && !gameSession.playerTwo) {
			setError("You are already in a queue as Player 1.");
		}
		else if (socketRef.current?.id && gameSession.playerOne && gameSession.playerTwo) {
			setError("You are in a session with two players, Player 1 can start the game.");
		}
	}


		const canvasRef = useRef<HTMLCanvasElement | null>(null);
		const [gameStatus, setGameStatus] = useState(0);
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
			event.preventDefault();
	
			if (socketRef.current?.id && !gameSession.playerOne && !gameSession.playerTwo) {
				setError("Joining Sessions Queue");
				socketRef.current.emit('join queue', user?.userID);
			}
			else if (socketRef.current?.id && gameSession.playerOne && !gameSession.playerTwo) {
				setError("You are already in the que as Player 1. Wait for Player 2.");
			}
			else if (socketRef.current?.id && gameSession.playerOne && gameSession.playerTwo) {
				setError("Both players have joined your session, Player 1 can start the game.");
			}
		}


		useEffect(() => {
			socketRef.current?.on('session joined', ({ sessionIdInput, playerInput }) => {
				if (playerInput === 1) {
					setGameSession((prevSession) => ({
						...prevSession,
						sessionId: sessionIdInput,
						player: playerInput,
						playerOne: socketRef.current?.id || '',
					}));
					setError("Joined a Session as Player 1");
					postUserStatus("InGameQueue", user!);
				} else if (playerInput === 2) {
					setGameSession((prevSession) => ({
						...prevSession,
						sessionId: sessionIdInput,
						player: playerInput,
						playerTwo: socketRef.current?.id || '',
					}));
					setError("Joined a session as Player 2");
					postUserStatus("InGameQueue", user!);
				}
			});
			
				socketRef.current?.on('opponent joined', (opponentSocketId: string) => {
					if (gameSession.player === 2) {
						setGameSession((prevSession) => ({
							...prevSession,
							playerOne: opponentSocketId,
						}));
					}
					if (gameSession.player === 1) {
						setGameSession((prevSession) => ({
							...prevSession,
							playerTwo: opponentSocketId,
					}));
					setError("Player 2 joined your session");
				}
			});

			socketRef.current?.on('clean queue', cleanQueue);
			socketRef.current?.on('already in session', () => {
				setError("Can't invite: player already in session/game");
			});

			return () => {
				socketRef.current?.off('session joined');
				socketRef.current?.off('opponent joined');
				socketRef.current?.off('clean queue', cleanQueue);
			};
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
			setError("Left session/queue. You can join a new queue or invite someone to play.");
		};
	
		let updateGameStatus = (newStatus:number) => {
			setGameStatus(newStatus);
		};
	
		function startGame(event: React.FormEvent) {
			if (gameSession.playerOne && gameSession.playerTwo) {
				if (socketRef.current?.id === gameSession.playerOne) {
					socketRef.current?.emit('start game', gameSession.sessionId);
				} else {
					setError("Please wait for Player One to start the game.");
				}
			}
		}

		function quitGame(event: React.FormEvent) {
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
					setError("Cancelling active invitation");
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
				setError("Nothing to quit");
			}
		}

			useEffect(() => {
				socketRef.current?.on('game starting', () => {
				setGameStatus(1);
				postUserStatus("inGame", user!);
				setIsGameStarting(true);
				if (invitation != null) {
					invitation.playerOneSocket = null;
					invitation.playerTwoSocket = null;
					invitation.sessionId = null;
				}
				});

				return () => {
				socketRef.current?.off('game starting'); // Unsubscribe from the event when the component unmounts
				};
			}, []);

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
			<ChatMainDiv
			user={user}
			userID={userID}
			yourId={socketRef.current ? socketRef.current.id : ""}
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
			<ErrorPopup message={error} onClose={() => setError(null)} />
		</div>
	);
}

export default ArenaChat;