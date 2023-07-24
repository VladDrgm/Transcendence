import React, { useState, useRef, useEffect, useCallback } from 'react';
import Form from "./UsernameForm";
import Chat_MainDiv from "./Chat_MainDiv";
import Game from './Game';
import GameForm from "./GameForm";
import { io, Socket } from "socket.io-client";
import immer, { Draft } from "immer";
import "../../App.css";
import {fetchChannelNames, copyChannelByName} from "../div/channel_utils"
import {postChannelUser, deleteChannelUser} from "../../api/channel/channel_user.api"
import { Channel } from '../../interfaces/channel.interface';
import { User } from '../../interfaces/user.interface';
// import { Channel } from 'diagnostics_channel';

interface ArenaDivProps
{
  userID: number;
  user: User;
}

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
	receiverId: string | number;
	isResolved: boolean;
	Channel: Channel;
};

const Arena_Chat_MainDiv: React.FC<ArenaDivProps> = ({userID, user}) => {
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
		});
		console.log("Posting User ", userID, " in Channel:", currentChat.Channel.ChannelId);
		postChannelUser(userID, currentChat.Channel.ChannelId);
		socketRef.current?.emit("join room", chatName, (messages: any) => roomJoinCallback(messages, chatName));
		setConnectedRooms(newConnectedRooms);
	}

	function leaveRoom(chatName: ChatName) {
		const newConnectedRooms = immer(connectedRooms, (draft: WritableDraft<typeof connectedRooms>) => {
			const chatNameString = String(chatName); // Convert chatName to string
			draft = draft.filter((room) => room !== chatNameString);
		});
		console.log("Removing User ", userID, " from Channel:", currentChat.Channel.ChannelId);
		deleteChannelUser(userID, currentChat.Channel.ChannelId);
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
	//const [gameReady, setGameState] = useState(false);

	type RegisterHandler = () => void;

	/* Update player states */
	socketRef.current?.on('playerOneAssignArena', playerOneIdInputAr);
	socketRef.current?.on('playerTwoAssignArena', playerTwoIdInputAr);
	socketRef.current?.on('audienceAssignArena', audienceIdInputAr);

	const [gameStatus, setGameStatus] = useState(0); // Initial game status is 0
	let updateGameStatus = (newStatus:number) => {
		setGameStatus(newStatus);
	};

	function playerOneIdInputAr(playerOneIdIn:string) {
		console.log("Reached playerOneIdInputArena");
		setPlayerOne(playerOneIdIn);
	}

	function playerTwoIdInputAr(playerTwoIdIn:string) {
		console.log("Reached playerTwoIdInputArena");
		setPlayerTwo(playerTwoIdIn);
	}

	function audienceIdInputAr(audienceIdIn:string) {
		console.log("Reached setAudienceArena");
		setAudience(audienceIdIn);
	}

	function registerPlayerOne(event: React.FormEvent) {
		event.preventDefault(); // Prevent the default form submission behavior
		
		if (socketRef.current?.id) {
			playerOne = socketRef.current.id;
			socketRef.current.emit("playerOneJoined", playerOne);
		}
		console.log("playerOne is: " + playerOne);
		console.log("playerTwo is: " + playerTwo);
	}

	function registerPlayerTwo(event: React.FormEvent) {
		event.preventDefault(); // Prevent the default form submission behavior
		
		if (socketRef.current?.id) {
			playerTwo = socketRef.current.id;
			socketRef.current.emit("playerTwoJoined", playerTwo);
		}
		console.log("playerOne is: " + playerOne);
		console.log("playerTwo is: " + playerTwo);
	}

	function registerAudience(event: React.FormEvent) {
		event.preventDefault(); // Prevent the default form submission behavior
		
		if (socketRef.current?.id) {
			audience = socketRef.current.id;
			socketRef.current.emit("audienceJoined", socketRef.current.id);
			console.log("You joined as audience/viewer");
		}
		console.log("playerOne is: " + playerOne);
		console.log("playerTwo is: " + playerTwo);
	}

	function startGame(event: React.FormEvent) {
		event.preventDefault(); // Prevent the default form submission behavior


	}

	function handleGameChange(e: React.ChangeEvent<HTMLInputElement>) {
	 //does nothing
	}


	/* rendering condition */
	let body;
	if (connected) {
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
			joinRoom={joinRoom}
			leaveRoom={leaveRoom}
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
	if (socketRef.current?.id) {
			gameBody = (
		<Game
			canvasRef={canvasRef}
			socket={socketRef.current}
			/* gameState={gameState} */
			updateGameStatus={updateGameStatus}
		/>
		);
	} else {
		gameBody = (
			<canvas width={800} height={400} style={{ backgroundColor: 'black' }} />
		);
	}

	gameBodyForm = (
	<GameForm
		registerPlayerOne={registerPlayerOne as RegisterHandler}
		registerPlayerTwo={registerPlayerTwo as RegisterHandler}
		registerAudience={registerAudience as RegisterHandler}
		startGame={startGame as RegisterHandler}
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