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

/* let playerOneSocket: string, playerTwoSocket: string; */
let userCount = 0; // userNr = 0;

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
			//io.sockets.emit('playerConnected', users[userNr]);
			//userNr++;
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



				/*              */
				// GAME PART //
				/*              */

	/* Game utilities */
	interface GameState {
		sessionId: string | null;
		gameStatus: number;
		playerOne: { id: string | null; socket: any; position: { x: number; y: number }; score: number };
		playerTwo: { id: string | null; socket: any; position: { x: number; y: number }; score: number };
		ball: { position: { x: number; y: number }; vel: { x: number; y: number; len: number } };
		timestamps: { start: number | null; end: number | null };
	}

	let gameSessions: { sessionId: string; playerIds: string[]; gameState?: GameState} [];
	let playerQueue: string[] = [];


	/* Joining game */

	function generateNewSessionId() {
		return Math.random().toString(36).substring(2, 10);
	}

	function createNewGameState(): GameState {
		return {
			sessionId: null,
			gameStatus: 0,
			playerOne: { id: null, socket: null, position: { x: 0, y: 0 }, score: 0 },
			playerTwo: { id: null, socket: null, position: { x: 0, y: 0 }, score: 0 },
			ball: { position: { x: 0, y: 0 }, vel: { x: 0, y: 0, len: 0 } },
			timestamps: { start: null, end: null }
		};
	}

	socket.on('join queue', () => {
		// Check if any available session exists
		const availableSession = gameSessions.find(
			(session) => session.playerIds.length === 1
		);
	
		// If an available session exists, join as Player 2
		if (availableSession) {
			availableSession.playerIds.push(socket.id);
	
		// Notify both players (Player 1 and Player 2) about the session details
		gameSessions.forEach((session) => {
			if (session.sessionId === availableSession.sessionId) {
				// Notify Player 1
				const playerOneSocketId = session.playerIds[0];
				io.to(playerOneSocketId).emit('session joined', {
					sessionId: session.sessionId,
					player: 1
			});
	
			// Notify Player 2
			io.to(socket.id).emit('session joined', {
				sessionId: session.sessionId,
				player: 2
			});
	
			// Notify Player 1 about the opponent joining
			io.to(playerOneSocketId).emit('opponent joined', socket.id);
			}
		});
		} else {
			// If no available session, create a new session and join as Player 1
			const newSessionId = generateNewSessionId();
			gameSessions.push({
				sessionId: newSessionId,
				playerIds: [socket.id],
				gameState: createNewGameState()
			});
	
			// Notify the player that they are Player 1 and provide the new sessionId
			io.to(socket.id).emit('session joined', {
				sessionId: newSessionId,
				player: 1
			});
			playerQueue.push(socket.id);
		}
	});
	
	// Handle playerTwoAssignArena event
	socket.on('playerTwoAssignArena', (playerTwoSocketId: string) => {
		// Find the session where player 1 and player 2 are matched
		const session = gameSessions.find(
			(session) => session.playerIds.includes(playerTwoSocketId) && session.playerIds.includes(socket.id)
		);
		if (session) {
			const playerOneSocketId = session.playerIds.find((playerId) => playerId !== playerTwoSocketId);

			// Notify player 1 about player 2 joining
			io.to(playerOneSocketId).emit('opponent joined', playerTwoSocketId);
		}
	});
	
	// Handle playerOneAssignArena event
	socket.on('playerOneAssignArena', (playerOneSocketId: string) => {
		// Find the session where player 1 and player 2 are matched
		const session = gameSessions.find(
			(session) => session.playerIds.includes(playerOneSocketId) && session.playerIds.includes(socket.id)
		);

		if (session) {
			const playerTwoSocketId = session.playerIds.find((playerId) => playerId !== playerOneSocketId);

			// Notify player 2 about player 1 joining
			io.to(playerTwoSocketId).emit('opponent joined', playerOneSocketId);
		}
	});


	/* STARTING GAME */

	socket.on('start game', (sessionId) => {
		// Check if the provided sessionId exists in the gameSessions array
		const session = gameSessions.find((session) => session.sessionId === sessionId);

		if (session) {
			// Get the number of players currently in the session
			const numPlayers = session.playerIds.length;

			if (numPlayers === 2) {
				// The session already has two players, the game can start
				io.to(session.playerIds[0]).emit('game starting', sessionId, 1);
				io.to(session.playerIds[1]).emit('game starting', sessionId, 2);
			} else {
				// There's only one player in the session, wait for the second player
				io.to(session.playerIds[0]).emit('waiting for opponent');
			}
		} else {
			// Invalid sessionId, notify the sender that the game session doesn't exist
			io.to(socket.id).emit('invalid session');
		}
	});


	/* Updating Gameplay Sessions */


	socket.on('updateGameState', (gameState) => {
		const { sessionId } = gameState;
	
		// Find the game session with the specified sessionId
		const session = gameSessions.find((session) => session.sessionId === sessionId);
	
		if (session) {
			// Update the gameState for the session
			session.gameState = gameState;
		
			// Emit the updated game state to all players in the session
			session.playerIds.forEach((playerId) => {
				io.to(playerId).emit('game state updated', session.gameState); // Sending the updated gameState to each player in the session
			});
		}
	});

	interface Ball {
		position: { x:number, y:number };
		vel: {x:number, y:number, len:number };
	};

	function updateBallPositionInSession(session: any, ballData: Ball) {
		const ballState = {
			position: { x: ballData.position, y: ballData.position.y },
			vel: {
				x: 150 * (Math.random() > 0.5 ? 1 : -1),
				y: 150 * (Math.random() * 2 - 1),
				len: 150
			}
		};
		// Emit the updated ball state to all players in the session
		session.playerIds.forEach((playerId:any) => {
			io.to(playerId).emit('ballStateUpdateStart', ballState);
		});
	}

	socket.on('updateBallPositionStart', (ballData: Ball) => {
		// Find the game session with the specified sessionId
		const session = gameSessions.find((session) =>
			session.playerIds.includes(socket.id)
		);

		if (session) {
			updateBallPositionInSession(session, ballData);
		}
	});


	/* DISCONNECT */


		socket.on('disconnect', () => {
			console.log('A user disconnected');
			io.sockets.emit('playerDisconnected');
			userCount--;
			users = users.filter(u => u.id !== socket.id);
			if (users.length !== 0) {
				io.emit('new user', users);
			}
			// Remove the player from the queue if they were waiting
			playerQueue = playerQueue.filter(playerId => playerId !== socket.id);
		});
});

server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
