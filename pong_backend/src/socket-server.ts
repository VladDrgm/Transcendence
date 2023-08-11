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
const FRAME_RATE = 10;

interface GameState {
	sessionId: string | null;
	gameStatus: number;
	playerOne: { id: string | null; socket: any; position: { x: number; y: number }; score: number; left:number; right:number; top:number; bottom:number, size: { x: number; y: number } };
	playerTwo: { id: string | null; socket: any; position: { x: number; y: number }; score: number; left:number; right:number; top:number; bottom:number, size: { x: number; y: number } };
	ball: Ball;
	timestamps: { start: number | null; end: number | null };
	dt: number;
	resetNeeded: boolean;
};

interface Ball {
	position: { x:number, y:number };
	vel: { x:number, y:number, len:number };
	left:number;
	right:number;
	top:number;
	bottom:number;
	size: { x:number, y:number };
};

let gameSessions: { sessionId: string; invite: boolean; playerIds: string[]; gameState?: GameState}[] = [];
let playerQueue: string[] = [];

const canvasWidth = 600;
const canvasHeight = 300;

/* Overall utilities */
let users: { username: string; socketId: string; userId: number }[] = []; // Array to store connected users

/* Chatroom utilities */
const messages: { [key: string]: { sender: string; content: string }[] } = {
	general: [],
};

const mutedUser = {};

function addChatRoom(roomName: string) {
	if (!messages.hasOwnProperty(roomName)) {
	  messages[roomName] = [];
	  console.log("new mas array added");
  }
}

function deleteChatRoom(roomName: string) {
	if (messages.hasOwnProperty(roomName)) {
	  delete messages[roomName];
	  console.log("msg array deleted");
  }
}

//let playerOneSocket: string, playerTwoSocket: string, audienceMemberSocket: string;
let userCount = 0, userNr = 0;

io.on('connection', (socket: Socket) => {
	console.log('A user connected on the server');
	userCount++;
	console.log('Users online: ' + userCount);
	socket.emit('init', { 
		data: 'hello!' 
	});

	socket.on('join server', (data) => {
		// playerName: string, userId: number
		const playerName = data.username;
		const userId = data.userId;
		console.log("Username in join server is: " + playerName);
		const existingUser = users.find(user => user.username === playerName);
		if(!existingUser) {
			const user = {
				username: playerName,
				socketId: socket.id,
				userId: userId
			};
			// console.log("Will this be triggered when the 2nd user joins?");
				users.push(user);
				io.emit('new user', users);
				io.sockets.emit('playerConnected', users[userNr]);
				userNr++;
		} else {
				// console.log("Cannot join -> user variable is null")
			existingUser.userId = userId;
			io.emit("new user", users);
			io.sockets.emit('playerConnected', users[userNr]);
		}
	});

	socket.on('join room', (roomName: string, cb: (messages: any[]) => void) => {
		// addChatRoom(roomName);
		if (!messages.hasOwnProperty(roomName)) {
			messages[roomName] = [];
		}
		socket.join(roomName);
		cb(messages[roomName]);
	});

	socket.on('update name', (username: string) => {
		const user = users.find(u => u.socketId === socket.id);
		if (user) {
			user.username = username;
		}
	});

	socket.on('delete room', (roomName) => {
		deleteChatRoom(roomName);
		io.emit('room deleted', roomName);
	});

	socket.on('add room', (roomName) => {
		addChatRoom(roomName);
		io.emit('room added', roomName);
	});

	socket.on('change room', (roomName) => {
		io.emit('room changed', roomName);
	});

	socket.on('add admin', (data) => {
		const newAdminUserID = data.newAdminUserID;
		const roomName  = data.roomName;
		// console.log("admin event recieved");
		io.emit('admin added', {newAdminUserID, roomName });
	});

	socket.on('ban user', (data) => {
		const targetId = data.targetId;
		const roomName = data.roomName;
		io.emit('user banned', {targetId, roomName });
	});

	socket.on('unban user', (data) => {
		const targetId = data.targetId;
		const roomName = data.roomName;
		io.emit('user unbanned', {targetId, roomName });
	});

	socket.on('mute user', (data) => {
		const targetId = data.targetId;
		const roomName = data.roomName;
		const muteDuration = data.muteDuration;

		io.emit('user muted', {targetId, roomName });
		if (mutedUser[targetId]) {
			clearTimeout(mutedUser[targetId].timeout);
			mutedUser[targetId].muteDuration =muteDuration;
			mutedUser[targetId].timeout = setTimeout(() => {
				io.emit('user unmuted', {targetId, roomName});
				delete mutedUser[targetId];
			}, muteDuration)
		}
		mutedUser[targetId] = {
			roomName, 
			muteDuration,
			timeout: setTimeout(() => {
				io.emit("user unmuted", {targetId, roomName});
				delete mutedUser[targetId];
			}, muteDuration)
		}
	});

	socket.on('send message', ({ content, to, sender, chatName, isChannel }) => {
		// console.log("content:", content);
		// console.log("sender:", sender);
		// console.log("chatName:", chatName);
		// console.log("isChannel", isChannel);
		// console.log("to:", to);
		// console.log("Messages:", messages);
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
			playerOne: { id: null, socket: null, position: { x: 0, y: 0 }, score: 0, left: 0, right: 0, top: 0, bottom: 0, size: { x: 0, y: 0 } },
			playerTwo: { id: null, socket: null, position: { x: 0, y: 0 }, score: 0, left: 0, right: 0, top: 0, bottom: 0, size: { x: 0, y: 0 } },
			ball: { position: { x: 0, y: 0 }, vel: { x: 0, y: 0, len: 0 }, left: 0, right: 0, top: 0, bottom: 0, size: { x: 0, y: 0 } },
			timestamps: { start: null, end: null },
			dt: 0,
			resetNeeded: false
		};
	}



	socket.on('join queue', () => {
		console.log("Join Queue was triggered");
		let availableSession:any;

		// check if player is already in a queue or session
		if (gameSessions.length !== 0) {
			let playerIsInSession = gameSessions.some(session => session.playerIds.includes(socket.id));
			if (playerIsInSession) {
				return;
			}
		}

		// Check if any available session exists
		if (gameSessions.length !== 0) {
			availableSession = gameSessions.find(
				(session) => session.playerIds.length === 1 && !session.invite
			);
		}

		if (gameSessions.length === 0 || !availableSession) {
			// If no available session, create a new session and join as Player 1
			console.log("New session created for Player 1");
			const newSessionId = generateNewSessionId();
			const newGameState = createNewGameState(); // Initialize the gameState
			gameSessions.push({
				sessionId: newSessionId,
				invite: false,
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

	socket.on('invite player', (newSessionId:any) => {
		console.log("Invite Player was triggered");
		let existingSession:any;

		// check if player is already in a queue or session
		if (gameSessions.length !== 0) {
			let playerIsInSession = gameSessions.some(session => session.playerIds.includes(socket.id));
			if (playerIsInSession) {
				return;
			}
		}

		// Check if a session exists with the given newSessionId
		if (newSessionId) {
			existingSession = gameSessions.find(
				(session) => session.sessionId === newSessionId
			);
		}

		if (!existingSession) {
			// If no existing session, create a new session and join as Player 1
			console.log("New session created for Player 1");
			const newSessionId = generateNewSessionId();
			const newGameState = createNewGameState(); // Initialize the gameState
			gameSessions.push({
				sessionId: newSessionId,
				invite: true,
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
			// If the existing session exists, join as Player 2
			console.log("Joining as Player 2 has been triggered");
			existingSession.playerIds.push(socket.id);

			// Notify both players (Player 1 and Player 2) about the session details
			gameSessions.forEach((session) => {
				if (session.sessionId === existingSession.sessionId) {
					// Notify Player 2
					console.log("Notifying Player 2 that he is player 2, his socketId is " + socket.id);
					socket.emit('session joined', {
						sessionIdInput: session.sessionId,
						playerInput: 2
					});
			
					// Notify each player of opponents
					let playerOneSocketId = session.playerIds[0];
					console.log("Notifying Player 1 of Player 2 joining, playerOneSocket being " + playerOneSocketId);
					socket.to(playerOneSocketId).emit('session joined', {
						sessionIdInput: session.sessionId,
						player: 1
					});
					
					console.log("Notifying Player 2 - " + socket.id + " who is player 1 - " + playerOneSocketId);
					socket.emit('opponent joined', playerOneSocketId);
					console.log("Notifying player 1 - " + playerOneSocketId + " who is Player 2 - " + socket.id);
					io.to(playerOneSocketId).emit('opponent joined', socket.id);
				}
			});
			console.log("Game sessions after joining as Player 2:", gameSessions);
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
				socket.to(session.playerIds[0]).emit('waiting for opponent');
			}
		} else {
			// Invalid sessionId, notify the sender that the game session doesn't exist
			socket.to(socket.id).emit('invalid session');
		}
	});


	/* Updating Gameplay Sessions */



	function startGameInterval(session: any) {
		const intervalId = setInterval(() => {
			let sessionWinner: boolean = false;
	
			// Check if the gameState, ball, and players exist and have correct shape
			if (!session || !session.gameState || !session.gameState.ball || 
				!session.gameState.playerOne || !session.gameState.playerTwo) {
				console.error('Incorrect game state structure: did the session end?');
				clearInterval(intervalId);
				return;
			}
	
			// Update ball's position
			session.gameState.ball.position.x += session.gameState.ball.vel.x * 0.05;
			session.gameState.ball.position.y += session.gameState.ball.vel.y * 0.05;


			/* Check for round winners and ball resetting */
			if (session.gameState.ball.position.x < 0 || session.gameState.ball.position.x > canvasWidth) {
				if (session.gameState.ball.vel.x < 0) {
					session.gameState.playerTwo.score++;
				}
				else {
					session.gameState.playerOne.score++;
				}
				
				// Reset ball's position to center and its velocity to default
				session.gameState.ball.position = { x: canvasWidth / 2, y: canvasHeight / 2 };
				session.gameState.ball.vel = { 
					x: 100 * (Math.random() > 0.5 ? 1 : -1),
					y: 100 * (Math.random() * 2 - 1),
					len: 100 };
					
					if (session.gameState.playerTwo.score === 5 || session.gameState.playerOne.score === 5) {
						sessionWinner = true;
					}
				}
				
				/* Collision with canvas top and bottom */
				if (session.gameState.ball.position.y < 0 || session.gameState.ball.position.y > canvasHeight) {
					session.gameState.ball.vel.y = -session.gameState.ball.vel.y;
				}

				//console.log("Collision data: \n Player data (left):" + JSON.stringify(session.gameState.playerOne) + "\n Ball data: " + JSON.stringify(session.gameState.ball) + "\n Player data (right): " + JSON.stringify(session.gameState.playerTwo) + "\n");

				// Update left, right, top, bottom
				session.gameState.playerOne = getBoundaries(session.gameState.playerOne);
				session.gameState.playerTwo = getBoundaries(session.gameState.playerTwo);
				session.gameState.ball = getBoundaries(session.gameState.ball);


				//console.log("Before potential collision, ballState is: " + JSON.stringify(session.gameState.ball));
				// Handle collisions with the players
				if (collide(session.gameState.playerOne, session.gameState.ball) === true || collide(session.gameState.playerTwo, session.gameState.ball) === true) {
					session.gameState.ball.vel.x = -session.gameState.ball.vel.x;
					session.gameState.ball.vel.y += 10;
					session.gameState.ball.vel.len *= 1.05;
			}


			// Decide what to do next: continue or session over
			if (sessionWinner === false) {
				io.to(session.playerIds[0]).emit('updateGameState', session.gameState);
				io.to(session.playerIds[1]).emit('updateGameState', session.gameState);
			} 
			else {
				io.to(session.playerIds[0]).emit('endGame', session.gameState);
				io.to(session.playerIds[1]).emit('endGame', session.gameState);
				clearInterval(intervalId);
			}
		}, 1000 / FRAME_RATE);
	};

	function getBoundaries(rect:any) {
		rect.left = rect.position.x - rect.size.x / 2;
		rect.right = rect.position.x + rect.size.x / 2;
		rect.top = rect.position.y - rect.size.y / 2;
		rect.bottom = rect.position.y + rect.size.y / 2;
		return rect;
	}


	function collide(player:any, ball:any) {
		if (player.left < ball.right &&
				player.right > ball.left &&
				player.top < ball.bottom &&
				player.bottom > ball.top) {
			return true; }
	};

	function updateBallPositionInSession(session: any, gameState:GameState) {
		let ballState:any;

		//console.log("\n gameState ball info:" + JSON.stringify(gameState.ball));

		if (gameState) {
			ballState = {
					position: { x: 400, y: 200 },
					vel: {
						x: 100 * (Math.random() > 0.5 ? 1 : -1),
						y: 100 * (Math.random() * 2 - 1),
						len: 100
					}
				};
		} 
			gameState.ball.position = ballState.position;
			gameState.ball.vel = ballState.vel;
			session.gameState = gameState;

			//console.log("Before starting game loop, kick-off ballState is: " + JSON.stringify(session.gameState.ball));
			startGameInterval(session);
	};

	socket.on('kickOffGame', (gameState: GameState) => {
		// Find the game session with the specified sessionId
		const session = gameSessions.find((session) =>
			session.playerIds.includes(socket.id)
		);
		
		//console.log("Reached Session Start, gameState is: " + JSON.stringify(gameState) + "\nand sessionData is: " + JSON.stringify(session));
		if (session && socket.id === session.playerIds[0]) {
			updateBallPositionInSession(session, gameState);
		}
	});

	socket.on('endSession', (gameState: GameState) => {
		console.log("Reached endSession");
		
		// Find the session the player is in
		const session = gameSessions.find((session) =>
			session.playerIds.includes(socket.id)
		);
	
		// Get the index of the session
		const sessionIndex = gameSessions.findIndex((session) => 
			session.playerIds.includes(socket.id)
		);
	
		// If the session is found
		if (session && sessionIndex !== -1) {
			// SEND SESSION DATA TO DB
			console.log("Placeholder for: sending session data to DB");
	
			// Unlink the gameState object by nullifying it
			gameSessions[sessionIndex].gameState = null;
			
			// Nullify the playerIds
			gameSessions[sessionIndex].playerIds = null;
			gameSessions.splice(sessionIndex, 1);
		}
	});



	socket.on('updateMovementPlayerOne', (key:any) => {
		const movementSpeed = 20;

		// Find the game session with the specified sessionId
		const session = gameSessions.find((session) =>
			session.playerIds.includes(socket.id)
		);

		if (key === 'w' || key === 'W') {
			session.gameState.playerOne.position.y -= movementSpeed;
		}  
		if (key === 's' || key === 'S') {
			session.gameState.playerOne.position.y += movementSpeed;
		}
	});

	socket.on('updateMovementPlayerTwo', (key:any) => {
		const movementSpeed = 20;

		// Find the game session with the specified sessionId
		const session = gameSessions.find((session) =>
			session.playerIds.includes(socket.id)
		);

		if (key === 'w' || key === 'W') {
			session.gameState.playerTwo.position.y -= movementSpeed;
		}  
		if (key === 's' || key === 'S') {
			session.gameState.playerTwo.position.y += movementSpeed;
		}
	});

	socket.on('updatePowerup', (key:any) => {
		// Find the game session with the specified sessionId
		const session = gameSessions.find((session) =>
			session.playerIds.includes(socket.id)
		);

		if (key === 'p' || key === 'P') {
			session.gameState.ball.vel.y += 50;
			session.gameState.ball.vel.len *= 1.3;
		}  
	});



	/* DISCONNECT */


		socket.on('disconnect', () => {
			console.log('A user disconnected');
			let sessionOfDisconnectedUser = gameSessions.find(session => 
				session.playerIds.includes(socket.id)
			);

			if (sessionOfDisconnectedUser) {
				// Find the other user in the session
				let otherUserId = sessionOfDisconnectedUser.playerIds.find(id => id !== socket.id);
		
				if (otherUserId) {
					// Emit to the other user in the session that the player has left
					io.to(otherUserId).emit('playerDisconnected');
				}
		
				// Remove the gameSession that the disconnected user was a part of - this will be done in endGame
				//gameSessions = gameSessions.filter(session => session !== sessionOfDisconnectedUser);
			}

			io.sockets.emit('playerDisconnected');
			userCount--;
			users = users.filter(u => u.socketId !== socket.id);
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
