import React, { useState, useRef, useEffect, useCallback } from 'react';
import Form from "./UsernameForm";
import Chat_MainDiv from "./Chat_MainDiv";
import Game from './Game';
import GameForm from "./GameForm";
import { io, Socket } from "socket.io-client";
import immer, { Draft } from "immer";
import "../../App.css";
import {fetchChannelNames, copyChannelByName, fetchAllChannels} from "../div/channel_utils"
import {postChannelUser, deleteChannelUser, getChannelUser, getChannelBlockedUser, getIsMuted} from "../../api/channel/channel_user.api"
import { Channel, ChannelUserRoles } from '../../interfaces/channel.interface';
import { User } from '../../interfaces/user.interface';
import { useUserContext } from '../context/UserContext';
import { connected } from 'process';
import { getIsAdmin } from '../../api/channel/channel_admin.api';
import { error } from 'console';
// import { Channel } from 'diagnostics_channel';

interface ArenaDivProps
{
  userID: number;
}

type WritableDraft<T> = Draft<T>;



let initialMessagesState: {
	[key: string]: { sender: string; content: string }[];
	//[key: number]: { sender: string; content: string }[];
} = {
	// general: [],
	// random: [],
	// jokes: [],
	// javascript: []
};

//Using fetched Channel Names to add as keys to the initialMessageState object
async function initializeMessagesState() {
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

type CurrentChat = {
	isChannel: boolean;
	chatName: ChatName;
	receiverId: string | number;
	isResolved: boolean;
	Channel: Channel;
};

const Arena_Chat_MainDiv: React.FC<ArenaDivProps> = ({userID}) => {
	const { user } = useUserContext()
	/* chat utilities */
	const [username, setUsername] = useState("");
	const [connected, setConnected] = useState(false);
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
	
	const [connectedRooms, setConnectedRooms] = useState<string[]>(["general"]);
	const [allUsers, setAllUsers] = useState<any[]>([]);
	const [allChannels, setAllChannels] = useState<any[]>([]);

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
					}
				})
				.catch((error) => {
					console.error("Error fetching all Channels: ", error);
				});
		} catch(error) {
			console.error('Error fetching all Channels:', error);
		}
	}, []);

	useEffect(() => {
		const intervalID = setInterval(() => {
			fetchAllChannels()
				.then((channels) => {
					setAllChannels(channels);
				})
				.catch((error) => {
					console.error("Error fetching all Channels: ", error);
				});
		}, 30000);
		return () => clearInterval(intervalID);
	}, []);

	useEffect(() => {initializeMessagesState();},[]);
	const [messages, setMessages] = useState<{
		[key in ChatName]: { sender: string; content: string }[];
	}>(initialMessagesState);
	// console.log('initialMessageState:', initialMessagesState);

	const [message, setMessage] = useState("");

	let [playerOne, setPlayerOne] = useState<string>("");
	let [playerTwo, setPlayerTwo] = useState<string>("");
	let [audience, setAudience] = useState<string>("");

	const socketRef = useRef<Socket | null>(null!);

	function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setMessage(e.target.value);
	}

	useEffect(() => {
		setMessage("");
	}, [messages]);

	function sendMessage() {
		console.log("message:", message);
		console.log("Messages :", messages);
		console.log("currentchat: ", currentChat);
		console.log("username : ", username);
		const payload = {
		content: message,
		to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
		sender: username,
		chatName: currentChat.chatName,
		isChannel: currentChat.isChannel
		};

		socketRef.current?.emit("send message", payload);
		const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
		//if the element doesn't exist, an empty one will be added
			if(!draft[currentChat.chatName]) {
				draft[currentChat.chatName] = [];
			}
			draft[currentChat.chatName].push({
				sender: username,
				content: message
			});
		});
		setMessages(newMessages);
		setMessage("");
	}

	function roomJoinCallback(incomingMessages: any, room: keyof typeof messages) {
	const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
		draft[room] = incomingMessages;
		console.log("Callback");
	});
	setMessages(newMessages);
	}

	function joinRoom(chatName: ChatName) {
		console.log("Posting User ", userID, " in Channel:", currentChat.Channel.ChannelId);
		postChannelUser(userID, currentChat.Channel.ChannelId)
			.then(()=> {
			socketRef.current?.emit("join room", chatName, (messages: any) => roomJoinCallback(messages, chatName))
			setCurrentRoles((prevState) => ({
				...prevState,
				isUser: true
			}))
			}).catch(error => {
				console.error("Error in joinRoom when adding User to Channel: ", error);
			});
	}

	function leaveRoom(chatName: ChatName) {
		// const newConnectedRooms = immer(connectedRooms, (draft: WritableDraft<typeof connectedRooms>) => {
		// 	const chatNameString = String(chatName); // Convert chatName to string
		// 	draft = draft.filter((room) => room !== chatNameString);
		// });
		console.log("Removing User ", userID, " from Channel:", currentChat.Channel.ChannelId);
		deleteChannelUser(userID, currentChat.Channel.ChannelId);
		// setConnectedRooms(newConnectedRooms);
	}

	function updateChannellist(newList: Channel[]){
		setAllChannels(newList);
	}

	async function toggleChat(newCurrentChat: CurrentChat) {
		socketRef.current?.emit("join room", newCurrentChat.chatName, (messages: any) => roomJoinCallback(messages, newCurrentChat.chatName));
		
		if (!messages[newCurrentChat.chatName]) {
		const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
			draft[newCurrentChat.chatName] = [];
		});
		
		setMessages(newMessages);
		}
		setCurrentChat(newCurrentChat);
	}

	useEffect(() => {
		handleUserInChannelCheck();
		handleUserInChannelBlockedCheck();
		handleUserInChannelMutedCheck();
		handleAdminCheck();
		handleOwnerCheck();
		console.log("in effect currentChat:", currentChat);
	}, [currentChat.chatName])
	

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
			getChannelUser(userID, currentChat.Channel.ChannelId)
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
			getChannelBlockedUser(userID, currentChat.Channel.ChannelId)
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
			getIsMuted(currentChat.Channel.ChannelId, userID, userID)
				.then((user) => {
					setCurrentRoles((prevState) => ({
						...prevState,
						isMuted:	user,
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
			getIsAdmin(currentChat.Channel.ChannelId, userID)
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

	function connect() {
	setConnected(true);
	socketRef.current = io("http://localhost:4000", {
	  transports: ["websocket"],
	  withCredentials: true,
	});
	console.log("What is being sent as username is: " + username);
	socketRef.current.emit("join server", username);
	socketRef.current.emit("join room", "general", (messages: any) => roomJoinCallback(messages, "general"));
	socketRef.current.on("new user", (allUsers: any) => {
		setAllUsers(allUsers);
	});
	socketRef.current.on("new message", ({ content, sender, chatName }: { content: string; sender: string; chatName: ChatName }) => {
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
		
		type RegisterHandler = () => void;
	
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
					//alert("Joined a Session as Player 1");
				} else if (playerInput === 2) {
					setGameSession((prevSession) => ({
						...prevSession,
						sessionId: sessionIdInput,
						player: playerInput,
						playerTwo: socketRef.current?.id || '',
					}));
					console.log("Player 2 set");
					//alert("Joined a session as Player 2");
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
					//alert("Player 2 joined your session");
				}
			});
	
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
			});
		
		function handleGameChange(e: React.ChangeEvent<HTMLInputElement>) {
		 //does nothing
		}
	

	/* rendering condition */
	let body;
	if (connected) {
		// console.log("before body:", currentChat);
		body = (
		<Chat_MainDiv
			user={user}
			userID={userID}
			message={message}
			handleMessageChange={handleMessageChange}
			sendMessage={sendMessage}
			yourId={socketRef.current ? socketRef.current.id : ""}
			allUsers={allUsers}
			allChannels={allChannels}
			updateChannellist={updateChannellist}
			joinRoom={joinRoom}
			leaveRoom={leaveRoom}
			connectedRooms={connectedRooms}
			currentChat={currentChat}
			messages={messages[currentChat.chatName]}
			toggleChat={toggleChat}
			ChannelUserRoles={currentRoles}
			username={username}
			loadingChannelPanel = {false}
		/>
		);
	} else {
		body = (
		<Form
			username={username}
			onChange={handleChange}
			connect={connect}
		/>
		);
	}

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
	} else {
		gameBody = <canvas width={600} height={300} style={{ backgroundColor: 'black' }} />;
	}

	gameBodyForm = (
		<GameForm
			joinQueue={joinQueue as RegisterHandler}
			startGame={startGame as RegisterHandler}
			gameSession={gameSession}
			isConnected={connected}
		/>
	);

	return (
		<div className="App">
		{body}
		{gameBody}
		{gameBodyForm}
		</div>
	);
}

export default Arena_Chat_MainDiv;