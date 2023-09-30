import React, { FC, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import { postUserStatus } from '../../api/statusUpdateAPI.api';

let BG_COLOR = '#000';
let FILL_COLOR = '#fff';

let CNVWIDTH = 600;
let CNVHEIGHT = 300;

let gamePixel = 6;
let CHARS:HTMLCanvasElement[];
let CHAR_PIXEL:number;

interface GameProps {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	socket: any;
	updateGameStatus: (newStatus: 0 | 1) => void;
	gameSession: { sessionId: string | null; player: number | null, playerOne: string | null, playerTwo: string | null };
	setGameSession: (gameSession: { sessionId: string | null; player: number | null, playerOne: string | null, playerTwo: string | null }) => void;
}

interface Ball {
	position: { x:number, y:number };
	vel: { x:number, y:number, len:number };
	left:number;
	right:number;
	top:number;
	bottom:number;
	size: { x:number, y:number };
};

interface GameState {
	sessionId: string | null;
	gameStatus: number;
	playerOne: { id: string | null; socket: any; position: { x: number; y: number }; score: number; left:number; right:number; top:number; bottom:number, size: { x: number; y: number } };
	playerTwo: { id: string | null; socket: any; position: { x: number; y: number }; score: number; left:number; right:number; top:number; bottom:number, size: { x: number; y: number } };
	ball: Ball;
	timestamps: { start: Date | null; end: Date | null };
	dt: number;
	disconnected: boolean;
	scoreOnDisconnect: { playerOne: number, playerTwo: number };
};

class Vec {
	x: number;
	y: number;

	constructor(x:number = 0, y:number = 0) {
		this.x = x;
		this.y = y;
	}

	get len() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	set len(value) {
		const fact = value / this.len;
		this.x *= fact;
		this.y *= fact;
	}
}

class Rect {
	position: any;
	size: any;
	constructor(w:number, h:number) {
		this.position = new Vec();
		this.size = new Vec(w, h);
	}
	get left() {
		return this.position.x - this.size.x / 2;
	}
	get right() {
		return this.position.x + this.size.x / 2;
	}
	get top() {
		return this.position.y - this.size.y / 2;
	}
	get bottom() {
		return this.position.y + this.size.y / 2;
	}
}

class BallClass extends Rect {
	vel:any;
	position:any;
	constructor() {
		super(gamePixel, gamePixel);
		this.vel = new Vec();
		this.position = new Vec();
	}
}

class Player extends Rect {
	score: number;
	constructor() {
		super(gamePixel * 2, gamePixel * 10);
		this.score = 0;
	}
}

class MiddleLine extends Rect {
	constructor() {
		super(gamePixel, gamePixel * 2);
	}
}

class Pong {
	_context:any;
	ball:BallClass;
	lines:any;
	players!:Player[];
	canvas!:any;
	
	constructor(canvas:any) {
		this.canvas = canvas;
		if (canvas) {
			this._context = canvas.getContext('2d');
		}

		CHAR_PIXEL = gamePixel;
		CHARS = [
		'111101101101111', // 0
		'010010010010010',
		'111001111100111',
		'111001111001111',
		'101101111001001',
		'111100111001111',
		'111100111101111',
		'111001001001001',
		'111101111101111',
		'111101111001111' // 9
		].map(str => {
			const charCanvas = document.createElement('canvas');
			charCanvas.height = CHAR_PIXEL * 5;
			charCanvas.width = CHAR_PIXEL * 3;
			const charContext = charCanvas.getContext('2d');
			if (charContext) {
				charContext.fillStyle = FILL_COLOR;
			}
			str.split('').forEach((fill, i) => {
				if (fill === '1') {
					if (charContext) {
						charContext.fillRect(
							(i % 3) * CHAR_PIXEL,
							(i / 3 | 0) * CHAR_PIXEL,
							CHAR_PIXEL,
							CHAR_PIXEL
						);
					}
				}
			});
			return charCanvas;
		});

			this.players = [];
			this.ball = new BallClass();

			/* Creates the middle line */
			let i, maxI;
			let lineHeight = gamePixel * 2;
			let startingPosition = 0;
			if (this.canvas) {
				maxI = this.canvas.height / (lineHeight * 2);
			}
			let lines = [];
			if (maxI && this.canvas) {
				for (i = 0; i <= maxI; i++) {
					lines.push(new MiddleLine());
					lines[i].position.x =this.canvas.width / 2;
					lines[i].position.y = startingPosition + (i * lineHeight * 2);
				}
			}
			this.lines = lines;

			/* Creates and places two players to initial positions */
			this.players = [
				new Player(),
				new Player(),
			];

			if (this.canvas) {
				this.players[0].position.x = gamePixel * 4;
				this.players[1].position.x = this.canvas.width - this.players[1].size.x - (gamePixel * 4);
				this.players.forEach((player: Player) => {
					player.position.y = (this.canvas.height - player.size.y) / 2;
				});
			}

			/* Sets ball starting position */
			if (this.canvas) {
				this.ball.position.x = this.canvas.width / 2;
				this.ball.position.y = this.canvas.height / 2;
			}

	};

	drawRect(rect:any) {
		this._context.fillStyle = FILL_COLOR;
		this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
	}

	drawScore() {
		if (this.canvas) {
			const align = this.canvas.width / 3;
			const CHAR_W = CHAR_PIXEL * 4;
			this.players.forEach((player:any, index:any) => {
				const chars = player.score.toString().split('');
				const offset =
					align *
					(index + 1) -
					CHAR_W * chars.length / 2 +
					CHAR_PIXEL / 2;
				chars.forEach((char:any, position:any) => {
					this._context.drawImage(CHARS[char | 0], offset + position * CHAR_W, (gamePixel * 2));
				});
			});
		}
	}

	draw() {
		this._context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the entire canvas

		this._context.fillStyle = BG_COLOR;
		if (this.canvas) {
			this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
		this.lines.forEach((line:any) => this.drawRect(line));

		/* Dynamic parts: */
		this.drawRect(this.ball);
		this.players.forEach((player:any) => this.drawRect(player));
		this.drawScore();
	}
	
	};

const Game: FC<GameProps> = (props) => {
		const { canvasRef, socket, updateGameStatus, gameSession, setGameSession } = props;
		const { user } = useUserContext();
		let gameState:GameState = {
			sessionId: null,
			gameStatus: 0,
			playerOne: { id: null, socket: null, position: { x: 0, y: 0 }, score: 0, left: 0, right: 0, top: 0, bottom: 0, size: { x: 0, y: 0 } },
			playerTwo: { id: null, socket: null, position: { x: 0, y: 0 }, score: 0, left: 0, right: 0, top: 0, bottom: 0, size: { x: 0, y: 0 } },
			ball: { position: { x: 0, y: 0 }, vel: { x: 0, y: 0, len: 0 }, left: 0, right: 0, top: 0, bottom: 0, size: { x: 0, y: 0 } },
			timestamps: { start: new Date(), end: null },
			dt: 0,
			disconnected: false,
			scoreOnDisconnect: { playerOne: 0, playerTwo: 0 }
		};

		gameState.gameStatus = 1;
		gameState.sessionId = gameSession.sessionId;
		gameState.playerOne.id = gameSession.playerOne;
		gameState.playerTwo.id = gameSession.playerTwo;
		gameState.playerOne.socket = gameSession.playerOne;
		gameState.playerTwo.socket = gameSession.playerTwo;


		useEffect(() => {
			//const canvas = document.createElement('canvas');
			const canvas = canvasRef.current;
			if (!canvas) return;

			canvas.height = CNVHEIGHT;
			canvas.width = CNVWIDTH;
			const context = canvas.getContext('2d');
			if (context) {
					context.fillStyle = FILL_COLOR;
			}

			// Initialize the Pong object once during the initial mount
			let pong: Pong | null = new Pong(canvas);

			pong.draw();

			function handleInit(msg:string) {
				console.log(msg);
			}
			
			function updateGameState(gameStateUpdated: GameState) {
				// eslint-disable-next-line
				gameState = gameStateUpdated;
				
				if (pong) {
					pong.ball.position = gameState.ball.position;
					pong.ball.vel = gameState.ball.vel;
					pong.players[0].position = gameState.playerOne.position;
					pong.players[1].position = gameState.playerTwo.position;
					pong.players[0].score = gameState.playerOne.score;
					pong.players[1].score = gameState.playerTwo.score;
					pong.draw();
				}
			};

			function playerDisconnected() {
				alert("Game Over: A Player Disconnected");
				endGame(gameState);
			}
			
			function endGame(gameStateUpdated: GameState) {
				postUserStatus("Online", user!);
				console.log("End game reached");
				if (gameState.playerOne.score === 0 && gameState.playerTwo.score === 0) {
					
				}
				else if (socket.id === gameSession.playerOne && gameState.playerOne.score > gameState.playerTwo.score ) {
					alert("You won!");
				}
				else if (socket.id === gameSession.playerOne && gameState.playerOne.score < gameState.playerTwo.score ) {
					alert("You lost!");
				}
				else if (socket.id === gameSession.playerTwo && gameState.playerOne.score > gameState.playerTwo.score ) {
					alert("You lost!");
				}
				else if (socket.id === gameSession.playerTwo && gameState.playerOne.score < gameState.playerTwo.score ) {
					alert("You won!");
				}
				else if (gameState.playerOne.score === gameState.playerTwo.score) {
					alert("It's a tie!");
				}
				socket.emit('endSession', gameState);
				setGameSession({
					sessionId: null,
					player: null,
					playerOne: null,
					playerTwo: null,
				});
				updateGameStatus(0);
				pong = null;
				return;
			};

			socket.on('init', handleInit);
			socket.on('updateGameState', updateGameState);
			socket.on('playerDisconnected', playerDisconnected);
			socket.on('endGame', endGame);


			/* update initial gameState */
			gameState.playerOne.position = pong.players[0].position;
			gameState.playerOne.size = pong.players[0].size;
			gameState.playerOne.score = pong.players[0].score;

			gameState.playerTwo.position = pong.players[1].position;
			gameState.playerTwo.size = pong.players[1].size;
			gameState.playerTwo.score = pong.players[1].score;

			gameState.ball.size = pong.ball.size;
			

			/* Starts the game session */
			socket.emit('kickOffGame', gameState);


			const handleRandomize = (event: KeyboardEvent) => {
				if (event.key === 'r' || event.key === 'R') {
					let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
					while (randomColor === "#FFFFFF") {
						randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
					}
					BG_COLOR = randomColor;
					if (pong) {
						pong.draw();
					}
				}
			};

			const handlePowerup = (event: KeyboardEvent) => {
				if (event.key === 'p' || event.key === 'P') {
					socket.emit('updatePowerup', event.key);
				}
			};

			document.addEventListener('keydown', handleRandomize);
			document.addEventListener('keydown', handlePowerup);
			
			return () => {
					socket.off('init', handleInit);
					socket.off('updateGameState', updateGameState);
					socket.off('playerDisconnected', playerDisconnected);
					socket.off('endGame', endGame);
					document.removeEventListener('keydown', handleRandomize);
					document.removeEventListener('keydown', handlePowerup);
				};

		});

		useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'w' || event.key === 'W') {
					if (socket.id === gameSession.playerOne) {
						socket.emit('updateMovementPlayerOne', event.key);
					}
					if (socket.id === gameSession.playerTwo) {
						socket.emit('updateMovementPlayerTwo', event.key);
					}

				}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
				if (event.key === 's' || event.key === 'S') {
					if (socket.id === gameSession.playerOne) {
						socket.emit('updateMovementPlayerOne', event.key);
					}
					if (socket.id === gameSession.playerTwo) {
						socket.emit('updateMovementPlayerTwo', event.key);
					}
				}
		};


		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	});

		return <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={CNVWIDTH} height={CNVHEIGHT} />;
	};
	
export default Game;