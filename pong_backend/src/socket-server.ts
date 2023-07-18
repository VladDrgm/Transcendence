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

/* Game utilities */
interface GameState {
	sessionId: string | null;
	gameStatus: number;
	playerOne: { id: string | null; socket: any; position: { x: number; y: number }; score: number };
	playerTwo: { id: string | null; socket: any; position: { x: number; y: number }; score: number };
	ball: { position: { x: number; y: number }; vel: { x: number; y: number; len: number } };
	timestamps: { start: number | null; end: number | null };
};

interface Ball {
	position: { x:number, y:number };
	vel: {x:number, y:number, len:number };
};

let gameSessions: { sessionId: string; playerIds: string[]; gameState?: GameState}[] = [];
let playerQueue: string[] = [];

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
		//console.log("Will this be triggered when the 2nd user joins?");
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
		console.log("Join Queue was triggered");
		let availableSession:any;

		// Check if any available session exists
		if (gameSessions.length !== 0) {
			availableSession = gameSessions.find(
				(session) => session.playerIds.length === 1
			);
		}

		if (gameSessions.length === 0 || !availableSession) {
			// If no available session, create a new session and join as Player 1
			console.log("New session created for Player 1");
			const newSessionId = generateNewSessionId();
			const newGameState = createNewGameState(); // Initialize the gameState
			gameSessions.push({
				sessionId: newSessionId,
				playerIds: [socket.id],
				gameState: newGameState,
			});

			// Notify the player that they are Player 1 and provide the new sessionId
			console.log("Emitting joining answer back to Player 1, for socketID " + socket.id);
			socket.emit('session joined', {
				sessionIdInput: newSessionId,
				playerInput: 1
			});
			playerQueue.push(socket.id);
			console.log("Game sessions after joining as Player 1:", gameSessions);
		} else {
			// If an available session exists, join as Player 2
			console.log("Joining as Player 2 has been triggered");
			availableSession.playerIds.push(socket.id);

			// Notify both players (Player 1 and Player 2) about the session details
			gameSessions.forEach((session) => {
				if (session.sessionId === availableSession.sessionId) {
					// Notify Player 2
					console.log("Notifying Player 2 that he is player 2, his socketId is " + socket.id);
					socket.emit('session joined', {
						sessionIdInput: session.sessionId,
						playerInput: 2
					});
			
					// Notify each player of opponents
					let playerOneSocketId = session.playerIds[0];
					/* console.log("Notifying Player 1 of Player 2 joining, playerOneSocket being " + playerOneSocketId);
					socket.to(playerOneSocketId).emit('session joined', {
						sessionIdInput: session.sessionId,
						player: 1
					}); */
					
					console.log("Notifying Player 2 - " + socket.id + " who is player 1 - " + playerOneSocketId);
					socket.emit('opponent joined', playerOneSocketId);
					console.log("Notifying player 1 - " + playerOneSocketId + " who is Player 2 - " + socket.id);
					io.to(playerOneSocketId).emit('opponent joined', socket.id);
				}
			});
			console.log("Game sessions after joining as Player 2:", gameSessions);
		}
	});


	// Handle playerOneAssignArena event
	/* socket.on('playerOneAssignArena', (playerOneSocketId: string) => {
		// Find the session where player 1 and player 2 are matched
		const session = gameSessions.find(
			(session) => session.playerIds.includes(playerOneSocketId) && session.playerIds.includes(socket.id)
		);

		if (session) {
			const playerTwoSocketId = session.playerIds.find((playerId) => playerId !== playerOneSocketId);

			// Notify player 2 about player 1 joining
			socket.to(playerTwoSocketId).emit('opponent joined', playerOneSocketId);
		}
	}); */


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
				socket.to(session.playerIds[0]).emit('waiting for opponent');
			}
		} else {
			// Invalid sessionId, notify the sender that the game session doesn't exist
			socket.to(socket.id).emit('invalid session');
		}
	});


	/* Updating Gameplay Sessions */

	socket.on('updateGameState', (gameState) => {
		const { sessionId } = gameState;

		if (!gameSessions) {
			console.error('Game sessions not initialized or empty.');
			return;
		}
	
		// Find the game session with the specified sessionId
		const session = gameSessions.find((session) => session.sessionId === sessionId);
	
		if (session) {
			// Update the gameState for the session
			session.gameState = gameState;
		
			// Emit the updated game state to all players in the session
			session.playerIds.forEach((playerId) => {
				console.log("\nPlayerID for updating GameState is: \n" + playerId + " in the session:\n " + JSON.stringify(session)+ "\n\n");
				io.to(playerId).emit('updateGameState', session.gameState); // Sending the updated gameState to each player in the session
			});
		}
	});

	function updateBallPositionInSession(session: any, ballData: Ball) {
		let ballState:any;
		if (ballData && ballData.position) {
			ballState = {
					position: { x: ballData.position.x, y: ballData.position.y },
					vel: {
						x: 150 * (Math.random() > 0.5 ? 1 : -1),
						y: 150 * (Math.random() * 2 - 1),
						len: 150
					}
				};
		} else {
			ballState = {
				position: { x: 400, y: 200 },
				vel: {
					x: 150 * (Math.random() > 0.5 ? 1 : -1),
					y: 150 * (Math.random() * 2 - 1),
					len: 150
				}
			};
		}
			// Emit the updated ball state to all players in the session
			console.log("Before emitting, kick-off ballState is: " + JSON.stringify(ballState));
			session.playerIds.forEach((playerId:any) => {
				io.to(playerId).emit('ballStateUpdateStart', ballState);
			});
	}

	socket.on('updateBallPositionStart', (ballData: Ball) => {
		// Find the game session with the specified sessionId
		const session = gameSessions.find((session) =>
		session.playerIds.includes(socket.id)
		);
		
		console.log("Reached Ball Initialization, ballData is: " + JSON.stringify(ballData) + "\nand sessionData is: " + JSON.stringify(session));
		if (session && socket.id === session.playerIds[0]) {
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
