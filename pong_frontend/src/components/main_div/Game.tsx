import React, { FC, useEffect, useRef, useState } from 'react';

interface GameProps {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	socket: any;
	updateGameStatus:any;
}

let gamePixel = 10;

let userCount = 0;
let playerOneId:string, playerTwoId:string, audienceId: string;

interface User {
	username: string;
	id: string;
}

interface Ball {
	position: { x:number, y:number };
	vel: {x:number, y:number, len:number };
};

interface GameState {
	sessionId: string | null;
	gameStatus: number;
	playerOne: { id: string | null; socket: any; position: { x: number; y: number }; score: number };
	playerTwo: { id: string | null; socket: any; position: { x: number; y: number }; score: number };
	audience: { id: string | null; socket: any };
	ball: Ball //{ position: { x: number; y: number }; vel: { x: number; y: number; len: number } };
	timestamps: { start: number | null; end: number | null };
}

const Game: FC<GameProps> = (props) => {
		const { canvasRef, socket, updateGameStatus } = props;
		const contextRef = useRef<CanvasRenderingContext2D | null>(null);
		let [gameState, setGameStatus] = useState<GameState>({
			sessionId: null,
			gameStatus: 0,
			playerOne: { id: null, socket: null, position: { x: 0, y: 0 }, score: 0 },
			playerTwo: { id: null, socket: null, position: { x: 0, y: 0 }, score: 0 },
			audience: { id: null, socket: null },
			ball: { position: { x: 0, y: 0 }, vel: { x: 0, y: 0, len: 0 } },
			timestamps: { start: null, end: null },
		});

		gameState.gameStatus = updateGameStatus;

		socket.on('init', handleInit);
		socket.on('playerConnected', playerConnected);
		socket.on('playerDisconnected', playerDisconnected);

		socket.on('playerOneAssign', playerOneIdInput);
		socket.on('playerTwoAssign', playerTwoIdInput);
		socket.on('audienceAssign', audienceIdInput);

		socket.on('ballStateUpdateStart', ballStateUpdate)
		socket.on('updateGameState', updateGameState);

		function playerOneIdInput(playerOneIdIn:string) {
			console.log("Reached playerOneIdInput");
			playerOneId = playerOneIdIn;
		}

		function playerTwoIdInput(playerTwoIdIn:string) {
			console.log("Reached playerTwoIdInput");
			playerTwoId = playerTwoIdIn;
		}

		function audienceIdInput(audienceIdIn:string) {
			audienceId = audienceIdIn;
		}

		function handleInit(msg:string) {
			console.log(msg);
		}

		function playerConnected(user:User) {
			console.log("A player connected: " + user.username + " with socket id " + user.id);
			userCount++;
		}

		function playerDisconnected(user:User) {
			console.log("Player " + user.username + " disconnected");
			userCount--;
		}

		function ballStateUpdate(ballState:Ball) {
			gameState.ball = ballState;
		}

	/* Most important: */
		function updateGameState(gameStateUpdated:GameState) {
			gameState = gameStateUpdated;
		}

	useEffect(() => 
	{
		const canvas = canvasRef.current;
		if (canvas) {
			const context = canvas.getContext('2d');
			contextRef.current = context; // Assign the 'context' value to the ref
		}
		const CHAR_PIXEL = gamePixel;
		const CHARS = [
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
			charContext.fillStyle = '#fff';
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
			pos: any;
			size: any;
			constructor(w:number, h:number) {
				this.pos = new Vec();
				this.size = new Vec(w, h);
			}
			get left() {
				return this.pos.x - this.size.x / 2;
			}
			get right() {
				return this.pos.x + this.size.x / 2;
			}
			get top() {
				return this.pos.y - this.size.y / 2;
			}
			get bottom() {
				return this.pos.y + this.size.y / 2;
			}
		}

		class Ball extends Rect {
			vel:any;
			pos:any;
			constructor() {
				super(gamePixel, gamePixel);
				this.vel = new Vec();
				this.pos = new Vec();
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
			ball:any;
			lines:any;
			players:any[];

			constructor() {
				this._context = contextRef.current;
				this.players = [];
				this.ball = new Ball();
				//this.gameStatePong = gameState;

				/* Creates the middle line */
				let i, maxI;
				let lineHeight = gamePixel * 2;
				let startingPosition = 0;
				if (canvas) {
					maxI = canvas.height / (lineHeight * 2);
				}
				let lines = [];
				if (maxI && canvas) {
					for (i = 0; i <= maxI; i++) {
						lines.push(new MiddleLine());
						lines[i].pos.x = canvas.width / 2;
						lines[i].pos.y = startingPosition + (i * lineHeight * 2);
					}
				}
				this.lines = lines;

				/* Creates and places two players to initial positions */
				this.players = [
					new Player(),
					new Player(),
				];

				if (canvas) {
					this.players[0].pos.x = gamePixel * 4;
					this.players[1].pos.x = canvas.width - this.players[1].size.x - (gamePixel * 4);
					this.players.forEach((player: Player) => {
						player.pos.y = (canvas.height - player.size.y) / 2;
					});
				}

				gameState.playerOne.position.x = this.players[0].pos.x;
				gameState.playerTwo.position.x = this.players[1].pos.x;
				gameState.playerOne.position.y = this.players[0].pos.y;
				gameState.playerTwo.position.y = this.players[1].pos.y;
				socket.emit('updateGameState', gameState);

				let lastTime:any;
				const callback = (millis:any) => {
					if (lastTime) {
						this.update((millis - lastTime) / 1000);
					}
					lastTime = millis;
					requestAnimationFrame(callback);
				};

				while (gameState.gameStatus !== 1) { //STOPS PROGRESS UNTIL GAMESTATUS IS 1
					//gameStatus changes with clicking button and IF game start conditions are met.
				}
				if (gameState.gameStatus === 1) {
					this.start();
					callback(Date.now());
				}
			};

			drawRect(rect:any) {
				this._context.fillStyle = '#fff';
				this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
			}
			
			collide(player:any, ball:any) {
				if (player.left < ball.right &&
						player.right > ball.left &&
						player.top < ball.bottom &&
						player.bottom > ball.top) {
					ball.vel.x = -ball.vel.x;
					ball.vel.y += 10
					ball.vel.len *= 1.08;
				}
				gameState.ball.vel.x = ball.vel.x;
				gameState.ball.vel.y = ball.vel.y;
				gameState.ball.vel.len = ball.vel.len;
				socket.emit('updateGameState', gameState);
			}

			draw() {
				this._context.fillStyle = '#000';
				if (canvas) {
					this._context.fillRect(0, 0, canvas.width, canvas.height);
				}
				this.drawRect(this.ball);
				this.players.forEach((player:any) => this.drawRect(player));
				this.lines.forEach((line:any) => this.drawRect(line));
				this.drawScore();
			}
			
			drawScore() {
				if (canvas) {
					const align = canvas.width / 3;
					const CHAR_W = CHAR_PIXEL * 4;
					this.players.forEach((player:any, index:any) => {
						const chars = player.score.toString().split('');
						const offset =
							align *
							(index + 1) -
							CHAR_W * chars.length / 2 +
							CHAR_PIXEL / 2;
						chars.forEach((char:any, pos:any) => {
							this._context.drawImage(CHARS[char | 0], offset + pos * CHAR_W, (gamePixel * 2));
						});
					});
				}
			}
			
			/* Starts the game */
			start() {
				console.log("This player is " + socket.id);
				if (canvas)
					console.log("Canvas exists in start()");
				if (canvas) {
					this.ball.pos.x = canvas.width / 2;
					this.ball.pos.y = canvas.height / 2;
					gameState.ball.position.x = this.ball.pos.x;
					gameState.ball.position.y = this.ball.pos.y;
					socket.emit('updateBallPositionStart', gameState);
				}
			}

			/* Resets ball after scoring. IF it works correctly both use cases, can be removed and switched out with start() */
			reset() {
				if (canvas) {
					console.log("New round: resetting ball position");
					this.ball.pos.x = canvas.width / 2;
					this.ball.pos.y = canvas.height / 2;
					gameState.ball.position.x = this.ball.pos.x;
					gameState.ball.position.y = this.ball.pos.y;
					socket.emit('updateBallPositionStart', gameState);
				}
			}
			
			update(dt:any) {
				// Initial position & velocity
				this.ball.pos.x = gameState.ball.position.x;
				this.ball.pos.y = gameState.ball.position.y;

				this.ball.vel.x = gameState.ball.vel.x;
				this.ball.vel.y = gameState.ball.vel.y;
				this.ball.vel.len = gameState.ball.vel.len;

				// Ball Movement
				this.ball.pos.x += this.ball.vel.x * dt;
				this.ball.pos.y += this.ball.vel.y * dt;

				/* Check if scores are correct; deal with scoring */
				this.players[0].score = gameState.playerOne.score;
				this.players[1].score = gameState.playerTwo.score;
			
				if (canvas && (this.ball.left < 0 || this.ball.right > canvas.width)) {
					let playerId;
					if (this.ball.vel.x < 0)
						playerId = 1;
					else
						playerId = 0;
					this.players[playerId].score++;
					gameState.playerOne.score = this.players[0].score;
					gameState.playerTwo.score = this.players[1].score;

					socket.emit('updateGameState', gameState);
					this.reset();
				}
			
				if (canvas && (this.ball.top < 0 || this.ball.bottom > canvas.height)) {
					this.ball.vel.y = -this.ball.vel.y;
				}
				gameState.ball.vel.y = this.ball.vel.y;
				socket.emit('updateGameState', gameState);

				this.players.forEach((player:Player) => this.collide(player, this.ball));

				this.draw();
				}
			}

			const pong = new Pong();

			/* new version for multiplayer mouse movement */
			if (canvas) {
				canvas.addEventListener('mousemove', event => {
					const rect = canvas.getBoundingClientRect();
					const scaleY = canvas.height / rect.height;
					const mouseY = (event.clientY - rect.top) * scaleY;

					if (socket.id === playerOneId) {
						//console.log("Reached mouse movemenet 1");
						pong.players[0].pos.y = mouseY;
						gameState.playerOne.position.y = pong.players[0].pos.y;
						socket.emit('updateGameState', gameState);
					}

					if (socket.id === playerTwoId) {
						//console.log("Reached mouse movemenet 2");
						pong.players[1].pos.y = mouseY;
						gameState.playerTwo.position.y = pong.players[1].pos.y;
						socket.emit('updateGameState', gameState);
					}
				});

				// Cleanup function
				return () => {
					canvas.removeEventListener('mousemove', () => { });
				};
			}
		
	}, []);
	return <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={800} height={400} />;
};

export default Game;