import React, { useState, useRef, useEffect, useCallback } from 'react';
import Form from "./UsernameForm";
import Chat from "./Chat_MainDiv";
import Game from './Game';
import GameForm from "./GameForm";
import { io, Socket } from "socket.io-client";
import immer, { Draft } from "immer";
import "../../App.css";
import {fetchChannelNames, copyChannelByName} from "../div/channel_div"
import {postChannelUser} from "../../api/channel.api"
import { Channel } from '../../interfaces/channel.interface';
// import { Channel } from 'diagnostics_channel';

type WritableDraft<T> = Draft<T>;



let initialMessagesState: {
	[key: string]: { sender: string; content: string }[];
	//[key: number]: { sender: string; content: string }[];
} = {
	general: [],
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

export type ChatName = keyof typeof initialMessagesState;

type CurrentChat = {
	isChannel: boolean;
	chatName: ChatName;
	receiverId: string;
	isResolved: boolean;
	Channel: Channel;
};

function Arena_Chat_MainDiv(): JSX.Element {
	/* chat utilities */
	const [username, setUsername] = useState("");
	const [connected, setConnected] = useState(false);
	const [currentChat, setCurrentChat] = useState<CurrentChat>({
		isChannel: true,
		chatName: "general",
		receiverId: "",
		isResolved: false,
		Channel: {} as Channel,
	});

	useEffect(() => {
		const fetchAndCopyChannel = async () => {
		  currentChat.isResolved = false;
		  const copiedChannel = await copyChannelByName(currentChat.chatName.toString());
		  if (copiedChannel) {
			setCurrentChat(prevState => ({
			  ...prevState,
			  Channel: copiedChannel,
			}));
		  }
		};
		fetchAndCopyChannel();
  	}, [setCurrentChat, currentChat.chatName]); //this calls fetchAndCopyCahnnel whenever setCurrentChat is called with a new Chatname
	
	useEffect(() => {
		if(currentChat.Channel && currentChat.Channel.ChannelId){
			currentChat.isResolved = true;
			console.log("Updating Channelobject in currentChat to:", currentChat.Channel.Name);
		}
	  }, [currentChat.Channel.Name]);

	const [connectedRooms, setConnectedRooms] = useState<string[]>(["general"]);
	const [allUsers, setAllUsers] = useState<any[]>([]);
	const [allChannels, setAllChannels] = useState<any[]>([]);
	useEffect(() => {initializeMessagesState();});
	const [messages, setMessages] = useState<{
		[key in ChatName]: { sender: string; content: string }[];
	}>(initialMessagesState);
	// console.log('initialMessageState:', initialMessagesState);

	const [message, setMessage] = useState("");

	const socketRef = useRef<Socket | null>(null!);

	function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setMessage(e.target.value);
	}

	useEffect(() => {
		setMessage("");
	}, [messages]);

	function sendMessage() {
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
		// console.log("Callback");
	});
	setMessages(newMessages);
	}

	function joinRoom(chatName: ChatName) {
	const newConnectedRooms = immer(connectedRooms, (draft: WritableDraft<typeof connectedRooms>) => {
		const chatNameString = String(chatName); // Convert chatName to string
		draft.push(chatNameString);

		//adding User to channel
		// console.log("Posting User 1 in Channel", currentChat.Channel.ChannelId);
		// postChannelUser(1, currentChat.Channel.ChannelId);
	});
	//User needs to be changed based on the real user after login is finished
	console.log("Posting User 1 in Channel:", currentChat.Channel.ChannelId);
	postChannelUser(1, currentChat.Channel.ChannelId);
	socketRef.current?.emit("join room", chatName, (messages: any) => roomJoinCallback(messages, chatName));
	setConnectedRooms(newConnectedRooms);
	}

	function toggleChat(currentChat: CurrentChat) {
		if (!messages[currentChat.chatName]) {
		const newMessages = immer(messages, (draft: WritableDraft<typeof messages>) => {
			draft[currentChat.chatName] = [];
		});
		setMessages(newMessages);
		}
		// console.log("Updating in toggle currenChatName", currentChat.chatName)
		setCurrentChat(currentChat);
	}

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
	
	//const [gameReady, setGameState] = useState(false);
	//let [playerOne, setPlayerOne] = useState<string>("");
	//let [playerTwo, setPlayerTwo] = useState<string>("");
	
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
	
		if (socketRef.current?.id) {
			console.log("Joining que emitting from Arena Chat, socketRef is: " + socketRef.current.id);
			socketRef.current.emit('join queue');
		}
	}
	
	/* useEffect(() => { */
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
			} else if (playerInput === 2) {
				setGameSession((prevSession) => ({
					...prevSession,
					sessionId: sessionIdInput,
					player: playerInput,
					playerTwo: socketRef.current?.id || '',
				}));
				console.log("Player 2 set");
				//socketRef.current?.emit('playerOneAssignArena', gameSession.playerOne || '');
			}
		});
	/* }, []); */

	/* useEffect(() => { */
		socketRef.current?.on('opponent joined', (opponentSocketId: string) => {
			console.log('Opponent joined with socketId:', opponentSocketId);
		
			// If player 2, save its socket ID for player 1 and vice versa
			if (gameSession.player === 2) {
				//socketRef.current?.emit('playerOneAssignArena', gameSession.playerOne || '');
				gameSession.playerOne = opponentSocketId;
			}
			if (gameSession.player === 1) {
				gameSession.playerTwo = opponentSocketId;
			}
		});
	/* }, []); */

	let updateGameStatus = (newStatus:number) => {
		setGameStatus(newStatus);
	};

	function startGame(event: React.FormEvent) {
		//event.preventDefault(); // Prevent the default form submission behavior
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
	/* useEffect(() => { */
		socketRef.current?.on('game starting', () => {
			// Change the gameStatus from 0 to 1
			setGameStatus(1);
			setIsGameStarting(true); // Set isGameStarting to true immediately
			// Wait for 5 seconds before setting isGameStarting to false
			/* const timer = setTimeout(() => {
				setIsGameStarting(false);
			}, 5000); */
			// Clean up the timer when the component unmounts or when gameStatus changes
			/* return () => clearTimeout(timer); */
		});
	/* }, []); */
	
	function handleGameChange(e: React.ChangeEvent<HTMLInputElement>) {
	 //does nothing
	}


	/* rendering condition */
	let body;
	if (connected) {
		body = (
		<Chat
			message={message}
			handleMessageChange={handleMessageChange}
			sendMessage={sendMessage}
			yourId={socketRef.current ? socketRef.current.id : ""}
			allUsers={allUsers}
			allChannels={allChannels}
			joinRoom={joinRoom}
			connectedRooms={connectedRooms}
			currentChat={currentChat}
			messages={messages[currentChat.chatName]}
			toggleChat={toggleChat}
			username={username}
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
		// Check if the game is starting (waiting for 5 seconds) or has started (isGameStarting is false)
		if (isGameStarting) {
			/* gameBody = <div>Game is starting...</div>;
		} else { */
			console.log("Game data is: \nCurrent socket: " + socketRef.current?.id + "\ngameStatus: " + gameStatus + "\ngameSession: " + JSON.stringify(gameSession) );
			gameBody = (
			<Game
				canvasRef={canvasRef}
				socket={socketRef.current}
				updateGameStatus={gameStatus}
				gameSession={gameSession}
			/>
			);
		}
	} else {
		gameBody = <canvas width={800} height={400} style={{ backgroundColor: 'black' }} />;
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