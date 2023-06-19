import * as express from 'express';
import { createServer, Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import * as cors from 'cors';

const app = express();
const server: Server = createServer(app);
const io: SocketServer = new SocketServer(server);
app.use(cors());

/* Change port for backend port switch */
const port = 4000;

/* Overall utilities */
let users: { username: string; id: string }[] = []; // Array to store connected users

/* Chatroom utilities */
const messages: { [key: string]: { sender: string; content: string }[] } = {
	general: [],
	random: [],
	jokes: [],
	javascript: []
};

let playerOneSocket: string, playerTwoSocket: string, audienceMemberSocket: string;
let userCount = 0, userNr = 0;

io.on('connection', (socket: Socket) => {
	console.log('A user connected on the server');
	userCount++;
	console.log('Users online: ' + userCount);
	socket.emit('init', { 
		data: 'hello!' 
	});

	socket.on('join server', (playerName) => {
		console.log("Username in join server is: " + playerName);
		const user = {
			username: playerName,
			id: socket.id
		};
		console.log("Will this be triggered when the 2nd user joins?");
		if (user !== null) {
			users.push(user);
			io.emit('new user', users);
			io.sockets.emit('playerConnected', users[userNr]);
			userNr++;
		} else {
			console.log("Cannot join -> user variable is null")
		}
	});

	socket.on('join room', (roomName: string, cb: (messages: any[]) => void) => {
		socket.join(roomName);
		cb(messages[roomName]);
	});

	socket.on('update name', (username: string) => {
		const user = users.find(u => u.id === socket.id);
		if (user) {
			user.username = username;
		}
	});

	socket.on('send message', ({ content, to, sender, chatName, isChannel }) => {
		if (isChannel) {
			const payload = {
				content,
				chatName,
				sender
			};
			socket.to(to).emit('new message', payload);
		} else {
			const payload = {
				content,
				chatName: sender,
				sender
		};
		socket.to(to).emit('new message', payload);
		}
		if (messages[chatName]) {
			messages[chatName].push({
				sender,
				content
		});
		}
	});


// 



	/* Joining game */
	socket.on('playerOneJoined', (playerOneId: string) => {
		console.log("Reached playerOneJoined");
		playerOneSocket = playerOneId;
		io.sockets.emit('playerOneAssign', playerOneSocket);
		io.sockets.emit('playerOneAssignArena', playerOneSocket);
	});

	socket.on('playerTwoJoined', (playerTwoId: string) => {
		console.log("Reached playerTwoJoined");
		playerTwoSocket = playerTwoId;
		io.sockets.emit('playerTwoAssign', playerTwoSocket);
		io.sockets.emit('playerTwoAssignArena', playerTwoSocket);
	});

	socket.on('audienceJoined', (audienceSocketId: string) => {
		audienceMemberSocket = audienceSocketId;
		io.sockets.emit('audienceAssign', audienceMemberSocket);
		io.sockets.emit('audienceAssignArena', audienceMemberSocket);
	});




	//

	interface GameState {
		sessionId: string | null;
		gameStatus: number;
		playerOne: { id: string | null; socket: any; position: { x: number; y: number }; score: number };
		playerTwo: { id: string | null; socket: any; position: { x: number; y: number }; score: number };
		audience: { id: string | null; socket: any };
		ball: { position: { x: number; y: number }; vel: { x: number; y: number; len: number } };
		timestamps: { start: number | null; end: number | null };
	}

	socket.on('updateGameState', (gameState:GameState) => {
		let gameStateUpdated = gameState;
		io.sockets.emit('updateGameState', gameStateUpdated);
	});


	//

	interface Ball {
		position: { x:number, y:number };
		vel: {x:number, y:number, len:number };
	};

	socket.on('updateBallPositionStart', (ballData: Ball) => {
		let ballState = {
			position: { x: ballData.position, y: ballData.position.y},
			vel: {
				x: 150 * (Math.random() > 0.5 ? 1 : -1),
				y: 150 * (Math.random() * 2 - 1),
				len: 150
			}
		}
		io.sockets.emit('ballStateUpdateStart', ballState);
	});


//


		socket.on('disconnect', () => {
			console.log('A user disconnected');
			io.sockets.emit('playerDisconnected', users[userNr]);
			userCount--;
			users = users.filter(u => u.id !== socket.id);
			if (users.length !== 0) {
				io.emit('new user', users);
			}
		});
});

server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});