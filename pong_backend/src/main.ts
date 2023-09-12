import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { Socket, Server } from 'socket.io';

const fetch = require('node-fetch');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const sessionOptions: SessionOptions = {
  //   //@Andrej when implementing authetication feel free to change this.
  //   secret: process.env.SESSION_SECRET, //keep in mind that u havet fix shared session services and delete GET login function from users.
  //   resave: false,
  //   saveUninitialized: true,
  //   cookie: {
  //     secure: false,
  //   },
  // };

  // app.use(session(sessionOptions));
  app.enableCors({
    origin: process.env.FRONTEND_URL, // frontend url
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const port = process.env.PORT || 8080;
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Create a Socket.io server that uses the same HTTP server instance as Nest.js
  const httpServer = app.getHttpServer();
  const io = new Server(httpServer);

  /* Game utilities */
  const FRAME_RATE = 10;

  interface GameState {
    sessionId: string | null;
    gameStatus: number;
    playerOne: {
      id: string | null;
      socket: any;
      position: { x: number; y: number };
      score: number;
      left: number;
      right: number;
      top: number;
      bottom: number;
      size: { x: number; y: number };
    };
    playerTwo: {
      id: string | null;
      socket: any;
      position: { x: number; y: number };
      score: number;
      left: number;
      right: number;
      top: number;
      bottom: number;
      size: { x: number; y: number };
    };
    ball: Ball;
    timestamps: { start: Date | null; end: Date | null };
    dt: number;
    disconnected: boolean;
    scoreOnDisconnect: { playerOne: number; playerTwo: number };
  }

  interface MatchEntity {
    Player1Id: number;
    Player2Id: number;
    Player1Points: number;
    Player2Points: number;
    GameType: string;
    FinalResultString: string;
    startTime: Date;
    endTime: Date;
    WinnerId: number;
    WinningCondition: string;
  }

  interface Ball {
    position: { x: number; y: number };
    vel: { x: number; y: number; len: number };
    left: number;
    right: number;
    top: number;
    bottom: number;
    size: { x: number; y: number };
  }

  interface Invitation {
    sessionId: any | null;
    playerOneSocket: string | null;
    playerTwoSocket: string | null;
  }

  const gameSessions: {
    sessionId: string;
    invite: boolean;
    playerIds: string[];
    gameState?: GameState;
    clientIdPO: number | null;
    clientIdPT: number | null;
  }[] = [];
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
      console.log('new mas array added');
    }
  }

  function deleteChatRoom(roomName: string) {
    if (messages.hasOwnProperty(roomName)) {
      delete messages[roomName];
      console.log('msg array deleted');
    }
  }

  //let playerOneSocket: string, playerTwoSocket: string, audienceMemberSocket: string;
  let userCount = 0,
    userNr = 0;

  io.on('connection', (socket: Socket) => {
    console.log('A user connected on the server');
    userCount++;
    console.log('Users online: ' + userCount);
    socket.emit('init', {
      data: 'hello!',
    });

    socket.on('join server', (data) => {
      // playerName: string, userId: number
      const playerName = data.username;
      const userId = data.userId;
      console.log('Username in join server is: ' + playerName);
      const existingUser = users.find((user) => user.username === playerName);
      if (!existingUser) {
        const user = {
          username: playerName,
          socketId: socket.id,
          userId: userId,
        };
        // console.log("Will this be triggered when the 2nd user joins?");
        users.push(user);
        io.emit('new user', users);
        io.sockets.emit('playerConnected', users[userNr]);
        userNr++;
      } else {
        // console.log("Cannot join -> user variable is null")
        existingUser.userId = userId;
        io.emit('new user', users);
        io.sockets.emit('playerConnected', users[userNr]);
      }
    });

    socket.on(
      'join room',
      (roomName: string, cb: (messages: any[]) => void) => {
        // addChatRoom(roomName);
        if (!messages.hasOwnProperty(roomName)) {
          messages[roomName] = [];
        }
        socket.join(roomName);
        cb(messages[roomName]);
      },
    );

    socket.on('update name', (username: string) => {
      const user = users.find((u) => u.socketId === socket.id);
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
      const roomName = data.roomName;
      // console.log("admin event recieved");
      io.emit('admin added', { newAdminUserID, roomName });
    });

    socket.on('ban user', (data) => {
      const targetId = data.targetId;
      const roomName = data.roomName;
      io.emit('user banned', { targetId, roomName });
    });

    socket.on('unban user', (data) => {
      const targetId = data.targetId;
      const roomName = data.roomName;
      io.emit('user unbanned', { targetId, roomName });
    });

    socket.on('block user', (data) => {
      const targetId = data.targetId;
      const username = data.username;
      io.emit('user blocked', { targetId, username });
    });

    socket.on('unblock user', (data) => {
      const targetId = data.targetId;
      const username = data.username;
      io.emit('user unblocked', { targetId, username });
    });

    socket.on('mute user', (data) => {
      const targetId = data.targetId;
      const roomName = data.roomName;
      const muteDuration = data.muteDuration;

      io.emit('user muted', { targetId, roomName });
      if (mutedUser[targetId]) {
        clearTimeout(mutedUser[targetId].timeout);
        mutedUser[targetId].muteDuration = muteDuration;
        mutedUser[targetId].timeout = setTimeout(() => {
          io.emit('user unmuted', { targetId, roomName });
          delete mutedUser[targetId];
        }, muteDuration);
      }
      mutedUser[targetId] = {
        roomName,
        muteDuration,
        timeout: setTimeout(() => {
          io.emit('user unmuted', { targetId, roomName });
          delete mutedUser[targetId];
        }, muteDuration),
      };
    });

    socket.on(
      'send message',
      ({ content, to, sender, chatName, isChannel }) => {
        console.log('content:', content);
        console.log('sender:', sender);
        console.log('chatName:', chatName);
        console.log('isChannel', isChannel);
        console.log('to:', to);
        console.log('Messages:', messages);
        if (isChannel) {
          const payload = {
            content,
            chatName,
            sender,
          };
          socket.to(to).emit('new message', payload);
        } else {
          const payload = {
            content,
            chatName: sender,
            sender,
          };
          socket.to(to).emit('new message', payload);
        }
        if (messages[chatName]) {
          messages[chatName].push({
            sender,
            content,
          });
        }
      },
    );

    /*              */
    // GAME PART //
    /*              */

    /* Joining game */

    function generateNewSessionId() {
      return Math.random().toString(36).substring(2, 10);
    }

    function createNewGameState(): GameState {
      const currentTime = new Date();
      return {
        sessionId: null,
        gameStatus: 0,
        playerOne: {
          id: null,
          socket: null,
          position: { x: 0, y: 0 },
          score: 0,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          size: { x: 0, y: 0 },
        },
        playerTwo: {
          id: null,
          socket: null,
          position: { x: 0, y: 0 },
          score: 0,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          size: { x: 0, y: 0 },
        },
        ball: {
          position: { x: 0, y: 0 },
          vel: { x: 0, y: 0, len: 0 },
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          size: { x: 0, y: 0 },
        },
        timestamps: { start: currentTime, end: null },
        dt: 0,
        disconnected: false,
        scoreOnDisconnect: { playerOne: 0, playerTwo: 0 },
      };
    }

    socket.on('join queue', (userID: number | undefined) => {
      console.log('Join Queue was triggered');
      let availableSession: any;

      // check if player is already in a queue or session
      if (gameSessions.length !== 0) {
        const playerIsInSession = gameSessions.some((session) =>
          session.playerIds.includes(socket.id),
        );
        if (playerIsInSession) {
          return;
        }
      }

      // Check if any available session exists
      if (gameSessions.length !== 0) {
        availableSession = gameSessions.find(
          (session) => session.playerIds.length === 1 && !session.invite,
        );
      }

      if (gameSessions.length === 0 || !availableSession) {
        // If no available session, create a new session and join as Player 1
        console.log('New session created for Player 1');
        const newSessionId = generateNewSessionId();
        const newGameState = createNewGameState(); // Initialize the gameState
        gameSessions.push({
          sessionId: newSessionId,
          invite: false,
          playerIds: [socket.id],
          gameState: newGameState,
          clientIdPO: userID,
          clientIdPT: null,
        });

        // Notify the player that they are Player 1 and provide the new sessionId
        console.log(
          'Emitting joining answer back to Player 1, for socketID ' + socket.id,
        );
        socket.emit('session joined', {
          sessionIdInput: newSessionId,
          playerInput: 1,
        });
        playerQueue.push(socket.id);
        console.log('Game sessions after joining as Player 1:', gameSessions);
      } else {
        // If an available session exists, join as Player 2
        console.log('Joining as Player 2 has been triggered');
        availableSession.playerIds.push(socket.id);
        availableSession.clientIdPT = userID;

        // Notify both players (Player 1 and Player 2) about the session details
        gameSessions.forEach((session) => {
          if (session.sessionId === availableSession.sessionId) {
            // Notify Player 2
            console.log(
              'Notifying Player 2 that he is player 2, his socketId is ' +
                socket.id,
            );
            socket.emit('session joined', {
              sessionIdInput: session.sessionId,
              playerInput: 2,
            });

            // Notify each player of opponents
            const playerOneSocketId = session.playerIds[0];
            /* console.log("Notifying Player 1 of Player 2 joining, playerOneSocket being " + playerOneSocketId);
					socket.to(playerOneSocketId).emit('session joined', {
						sessionIdInput: session.sessionId,
						player: 1
					}); */

            console.log(
              'Notifying Player 2 - ' +
                socket.id +
                ' who is player 1 - ' +
                playerOneSocketId,
            );
            socket.emit('opponent joined', playerOneSocketId);
            console.log(
              'Notifying player 1 - ' +
                playerOneSocketId +
                ' who is Player 2 - ' +
                socket.id,
            );
            io.to(playerOneSocketId).emit('opponent joined', socket.id);
          }
        });
        console.log('Game sessions after joining as Player 2:', gameSessions);
      }
    });

    socket.on(
      'invite player',
      (invitation: Invitation, userID: number | undefined, username: string) => {
        console.log('Invite Player was triggered');
        let existingSession: any;

        // check if player is already in a queue or session
        if (gameSessions.length !== 0) {
          const playerIsInSession = gameSessions.some((session) =>
            session.playerIds.includes(socket.id),
          );
          if (playerIsInSession) {
            return;
          }
        }

        // Check if a session exists with the given invitation.sessionId
        if (invitation.sessionId) {
          existingSession = gameSessions.find(
            (session) => session.sessionId === invitation.sessionId,
          );
        }

        if (!existingSession) {
          // If no existing session, create a new session and join as Player 1
          console.log('New session created for Player 1');
          const newSessionId = generateNewSessionId();
          const newGameState = createNewGameState(); // Initialize the gameState
          gameSessions.push({
            sessionId: newSessionId,
            invite: true,
            playerIds: [socket.id],
            gameState: newGameState,
            clientIdPO: userID,
            clientIdPT: null,
          });

          // Notify the player that they are Player 1 and provide the new sessionId
          console.log(
            'Emitting joining answer back to Player 1, for socketID ' +
              socket.id,
          );
          socket.emit('session joined', {
            sessionIdInput: newSessionId,
            playerInput: 1,
          });

          invitation.sessionId = newSessionId;
          // SEND INVITE TO PLAYER TWO
          socket
            .to(invitation.playerTwoSocket)
            .emit('invitation alert playertwo', { invitation, username});

          playerQueue.push(socket.id);
          console.log('Game sessions after joining as Player 1:', gameSessions);
        } else {
          // If the existing session exists, join as Player 2
          console.log('Joining as Player 2 has been triggered');
          existingSession.playerIds.push(socket.id);
          existingSession.clientIdPT = userID;

          // Notify both players (Player 1 and Player 2) about the session details
          gameSessions.forEach((session) => {
            if (session.sessionId === existingSession.sessionId) {
              // Notify Player 2
              console.log(
                'Notifying Player 2 that he is player 2, his socketId is ' +
                  socket.id,
              );
              socket.emit('session joined', {
                sessionIdInput: session.sessionId,
                playerInput: 2,
              });

              // Notify each player of opponents
              const playerOneSocketId = session.playerIds[0];
              console.log(
                'Notifying Player 1 of Player 2 joining, playerOneSocket being ' +
                  playerOneSocketId,
              );
              socket.to(playerOneSocketId).emit('session joined', {
                sessionIdInput: session.sessionId,
                player: 1,
              });

              console.log(
                'Notifying Player 2 - ' +
                  socket.id +
                  ' who is player 1 - ' +
                  playerOneSocketId,
              );
              socket.emit('opponent joined', playerOneSocketId);
              console.log(
                'Notifying player 1 - ' +
                  playerOneSocketId +
                  ' who is Player 2 - ' +
                  socket.id,
              );
              io.to(playerOneSocketId).emit('opponent joined', socket.id);
            }
          });
          console.log('Game sessions after joining as Player 2:', gameSessions);
        }
      },
    );

    /* STARTING GAME */

    socket.on('start game', (sessionId) => {
      // Check if the provided sessionId exists in the gameSessions array
      const session = gameSessions.find(
        (session) => session.sessionId === sessionId,
      );

      if (session) {
        // Get the number of players currently in the session
        const numPlayers = session.playerIds.length;

        if (numPlayers === 2) {
          // The session already has two players, the game can start
          io.to(session.playerIds[0]).emit('game starting', sessionId, 1);
          io.to(session.playerIds[1]).emit('game starting', sessionId, 2);
        }
        /* else {
				// There's only one player in the session, wait for the second player
				socket.to(session.playerIds[0]).emit('waiting for opponent');
			} */
      }
      /* else {
			// Invalid sessionId, notify the sender that the game session doesn't exist
			socket.to(socket.id).emit('invalid session');
		} */
    });

    socket.on('remove invite', (invitation: Invitation) => {
      console.log('Remove Invite was triggered');
      let existingSession: any;

      // Check if a session exists with the given invitation.sessionId
      if (invitation.sessionId) {
        existingSession = gameSessions.find(
          (session) => session.sessionId === invitation.sessionId,
        );
      }

      if (existingSession) {
        // If the existing session exists, Player 1 has to be quit
        console.log('Quitting Player 1 has been triggered');
        if (existingSession.playerIds[0]) {
          io.to(existingSession.playerIds[0]).emit('clean queue');
        }
        existingSession.sessionId = null;
        existingSession.invite = false;

        // Get the index of the session
        const sessionIndex = gameSessions.indexOf(existingSession);

        // Unlink the gameState object by nullifying it
        if (gameSessions[sessionIndex].gameState) {
          gameSessions[sessionIndex].gameState = null;
        }

        // Nullify the playerIds
        gameSessions[sessionIndex].playerIds = null;
        gameSessions.splice(sessionIndex, 1);

        // Remove the player from the queue if they were waiting
        playerQueue = playerQueue.filter((playerId) => playerId !== socket.id);
      }
    });

    socket.on('quit game', (sessionId) => {
      console.log('A user quit the game');
      // Check if the provided sessionId exists in the gameSessions array
      const sessionOfDisconnectedUser = gameSessions.find(
        (session) => session.sessionId === sessionId,
      );

      if (sessionOfDisconnectedUser) {
        sessionOfDisconnectedUser.gameState.disconnected = true;
        sessionOfDisconnectedUser.gameState.scoreOnDisconnect.playerOne =
          sessionOfDisconnectedUser.gameState.playerOne.score;
        sessionOfDisconnectedUser.gameState.scoreOnDisconnect.playerTwo =
          sessionOfDisconnectedUser.gameState.playerTwo.score;

        // Find the users in the session
        const firstUserId = sessionOfDisconnectedUser.playerIds.find(
          (id) => id === socket.id,
        );
        const otherUserId = sessionOfDisconnectedUser.playerIds.find(
          (id) => id !== socket.id,
        );

        if (firstUserId) {
          // Emit to the quitting user in the session that the game is ending
          io.to(firstUserId).emit('playerDisconnected');
        }
        if (otherUserId) {
          // Emit to the other user in the session that the player has left
          io.to(otherUserId).emit('playerDisconnected');
        }
      }
    });

    socket.on('quit queue', (sessionId) => {
      // Check if the provided sessionId exists in the gameSessions array
      const session = gameSessions.find(
        (session) => session.sessionId === sessionId,
      );

      if (session) {
        if (session.playerIds[0]) {
          io.to(session.playerIds[0]).emit('clean queue');
        }
        if (session.playerIds[1]) {
          io.to(session.playerIds[1]).emit('clean queue');
        }
        session.sessionId = null;
        session.invite = false;

        // Get the index of the session
        const sessionIndex = gameSessions.indexOf(session);

        // Unlink the gameState object by nullifying it
        if (gameSessions[sessionIndex].gameState) {
          gameSessions[sessionIndex].gameState = null;
        }

        // Nullify the playerIds
        gameSessions[sessionIndex].playerIds = null;
        gameSessions.splice(sessionIndex, 1);

        // Remove the player from the queue if they were waiting
        playerQueue = playerQueue.filter((playerId) => playerId !== socket.id);
      }
    });

    /* Updating Gameplay Sessions */

    function startGameInterval(session: any) {
      const intervalId = setInterval(() => {
        let sessionWinner = false;

        // Check if the gameState, ball, and players exist and have correct shape
        if (
          !session ||
          !session.gameState ||
          !session.gameState.ball ||
          !session.gameState.playerOne ||
          !session.gameState.playerTwo
        ) {
          console.error(
            'Incorrect game state structure: did the session end? (This is not an error, but a notification)',
          );
          clearInterval(intervalId);
          return;
        }

        // Update ball's position
        session.gameState.ball.position.x +=
          session.gameState.ball.vel.x * 0.05;
        session.gameState.ball.position.y +=
          session.gameState.ball.vel.y * 0.05;

        /* Check for round winners and ball resetting */
        if (
          session.gameState.ball.position.x < 0 ||
          session.gameState.ball.position.x > canvasWidth
        ) {
          if (session.gameState.ball.vel.x < 0) {
            session.gameState.playerTwo.score++;
          } else {
            session.gameState.playerOne.score++;
          }

          // Reset ball's position to center and its velocity to default
          session.gameState.ball.position = {
            x: canvasWidth / 2,
            y: canvasHeight / 2,
          };
          session.gameState.ball.vel = {
            x: 100 * (Math.random() > 0.5 ? 1 : -1),
            y: 100 * (Math.random() * 2 - 1),
            len: 100,
          };

          if (
            session.gameState.playerTwo.score === 5 ||
            session.gameState.playerOne.score === 5
          ) {
            sessionWinner = true;
          }
        }

        /* Collision with canvas top and bottom */
        if (
          session.gameState.ball.position.y < 0 ||
          session.gameState.ball.position.y > canvasHeight
        ) {
          session.gameState.ball.vel.y = -session.gameState.ball.vel.y;
        }

        //console.log("Collision data: \n Player data (left):" + JSON.stringify(session.gameState.playerOne) + "\n Ball data: " + JSON.stringify(session.gameState.ball) + "\n Player data (right): " + JSON.stringify(session.gameState.playerTwo) + "\n");

        // Update left, right, top, bottom
        session.gameState.playerOne = getBoundaries(
          session.gameState.playerOne,
        );
        session.gameState.playerTwo = getBoundaries(
          session.gameState.playerTwo,
        );
        session.gameState.ball = getBoundaries(session.gameState.ball);

        //console.log("Before potential collision, ballState is: " + JSON.stringify(session.gameState.ball));
        // Handle collisions with the players
        if (
          collide(session.gameState.playerOne, session.gameState.ball) ===
            true ||
          collide(session.gameState.playerTwo, session.gameState.ball) === true
        ) {
          session.gameState.ball.vel.x = -session.gameState.ball.vel.x;
          session.gameState.ball.vel.y += 10;
          session.gameState.ball.vel.len *= 1.05;
        }

        // Decide what to do next: continue or session over
        if (sessionWinner === false) {
          io.to(session.playerIds[0]).emit(
            'updateGameState',
            session.gameState,
          );
          io.to(session.playerIds[1]).emit(
            'updateGameState',
            session.gameState,
          );
        } else {
          io.to(session.playerIds[0]).emit('endGame', session.gameState);
          io.to(session.playerIds[1]).emit('endGame', session.gameState);
          clearInterval(intervalId);
        }
      }, 1000 / FRAME_RATE);
    }

    function getBoundaries(rect: any) {
      rect.left = rect.position.x - rect.size.x / 2;
      rect.right = rect.position.x + rect.size.x / 2;
      rect.top = rect.position.y - rect.size.y / 2;
      rect.bottom = rect.position.y + rect.size.y / 2;
      return rect;
    }

    function collide(player: any, ball: any) {
      if (
        player.left < ball.right &&
        player.right > ball.left &&
        player.top < ball.bottom &&
        player.bottom > ball.top
      ) {
        return true;
      }
    }

    function updateBallPositionInSession(session: any, gameState: GameState) {
      let ballState: any;

      //console.log("\n gameState ball info:" + JSON.stringify(gameState.ball));

      if (gameState) {
        ballState = {
          position: { x: 400, y: 200 },
          vel: {
            x: 100 * (Math.random() > 0.5 ? 1 : -1),
            y: 100 * (Math.random() * 2 - 1),
            len: 100,
          },
        };
      }
      gameState.ball.position = ballState.position;
      gameState.ball.vel = ballState.vel;
      session.gameState = gameState;

      //console.log("Before starting game loop, kick-off ballState is: " + JSON.stringify(session.gameState.ball));
      startGameInterval(session);
    }

    socket.on('kickOffGame', (gameState: GameState) => {
      // Find the game session with the specified sessionId
      const session = gameSessions.find((session) =>
        session.playerIds.includes(socket.id),
      );

      //console.log("Reached Session Start, gameState is: " + JSON.stringify(gameState) + "\nand sessionData is: " + JSON.stringify(session));
      if (session && socket.id === session.playerIds[0]) {
        updateBallPositionInSession(session, gameState);
      }
    });

    socket.on('endSession', (gameState: GameState) => {
      console.log('Reached endSession');
      const matchResults = {} as MatchEntity;

      // Find the session the player is in
      const session = gameSessions.find((session) =>
        session.playerIds.includes(socket.id),
      );

      // Get the index of the session
      const sessionIndex = gameSessions.findIndex((session) =>
        session.playerIds.includes(socket.id),
      );

      // If the session is found
      if (session && sessionIndex !== -1) {
        //Populate matchResults
        matchResults.FinalResultString = 'finished';
        if (session.invite) {
          matchResults.GameType = 'invite';
        } else {
          matchResults.GameType = 'normal';
        }
        matchResults.Player1Id = session.clientIdPO;
        if (session.gameState.disconnected === true) {
          matchResults.Player1Points =
            session.gameState.scoreOnDisconnect.playerOne;
          matchResults.Player2Points =
            session.gameState.scoreOnDisconnect.playerTwo;
          matchResults.WinningCondition = 'disconnected';
        } else {
          matchResults.Player1Points = session.gameState.playerOne.score;
          matchResults.Player2Points = session.gameState.playerTwo.score;
          matchResults.WinningCondition = 'game won';
        }
        matchResults.Player2Id = session.clientIdPT;
        if (matchResults.Player1Points === matchResults.Player2Points) {
          matchResults.WinnerId = 0;
        } else if (matchResults.Player1Points > matchResults.Player2Points) {
          matchResults.WinnerId = matchResults.Player1Id;
        } else {
          matchResults.WinnerId = matchResults.Player2Id;
        }
        matchResults.endTime = new Date();
        matchResults.startTime = session.gameState.timestamps.start;

        console.log('matchResults is: ' + JSON.stringify(matchResults) + '/n');

        console.log('the URI is: ' + process.env.URI);

        fetch(process.env.URI + 'match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(matchResults),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Data sent successfully:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        // Unlink the gameState object by nullifying it
        gameSessions[sessionIndex].gameState = null;

        // Nullify the playerIds
        gameSessions[sessionIndex].playerIds = null;
        gameSessions.splice(sessionIndex, 1);
      }
    });

    socket.on('updateMovementPlayerOne', (key: any) => {
      const movementSpeed = 15;
      const canvasTopBoundary = 0;
      const canvasBottomBoundary = canvasHeight;

      // Find the game session with the specified sessionId
      const session = gameSessions.find((session) =>
        session.playerIds.includes(socket.id),
      );

      let newPosition = session.gameState.playerOne.position.y;

      if (key === 'w' || key === 'W') {
        newPosition -= movementSpeed;
      }
      if (key === 's' || key === 'S') {
        newPosition += movementSpeed;
      }

      if (
        newPosition - 30 >= canvasTopBoundary &&
        newPosition + 30 <= canvasBottomBoundary
      ) {
        session.gameState.playerOne.position.y = newPosition;
      }
    });

    socket.on('updateMovementPlayerTwo', (key: any) => {
      const movementSpeed = 15;
      const canvasTopBoundary = 0;
      const canvasBottomBoundary = canvasHeight;

      // Find the game session with the specified sessionId
      const session = gameSessions.find((session) =>
        session.playerIds.includes(socket.id),
      );

      let newPosition = session.gameState.playerTwo.position.y;

      if (key === 'w' || key === 'W') {
        newPosition -= movementSpeed;
      }
      if (key === 's' || key === 'S') {
        newPosition += movementSpeed;
      }

      if (
        newPosition - 30 >= canvasTopBoundary &&
        newPosition + 30 <= canvasBottomBoundary
      ) {
        session.gameState.playerTwo.position.y = newPosition;
      }
    });

    socket.on('updatePowerup', (key: any) => {
      // Find the game session with the specified sessionId
      const session = gameSessions.find((session) =>
        session.playerIds.includes(socket.id),
      );

      if (key === 'p' || key === 'P') {
        session.gameState.ball.vel.y += 50;
        session.gameState.ball.vel.len *= 1.3;
      }
    });

    /* DISCONNECT */

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      const sessionOfDisconnectedUser = gameSessions.find((session) =>
        session.playerIds.includes(socket.id),
      );

      if (sessionOfDisconnectedUser) {
        sessionOfDisconnectedUser.gameState.disconnected = true;
        sessionOfDisconnectedUser.gameState.scoreOnDisconnect.playerOne =
          sessionOfDisconnectedUser.gameState.playerOne.score;
        sessionOfDisconnectedUser.gameState.scoreOnDisconnect.playerTwo =
          sessionOfDisconnectedUser.gameState.playerTwo.score;

        // Find the other user in the session
        const otherUserId = sessionOfDisconnectedUser.playerIds.find(
          (id) => id !== socket.id,
        );

        if (otherUserId) {
          // Emit to the other user in the session that the player has left
          io.to(otherUserId).emit('playerDisconnected');
        }

        // Remove the gameSession that the disconnected user was a part of - this will be done in endGame
        //gameSessions = gameSessions.filter(session => session !== sessionOfDisconnectedUser);
      }

      //io.sockets.emit('playerDisconnected');
      userCount--;
      users = users.filter((u) => u.socketId !== socket.id);
      if (users.length !== 0) {
        io.emit('new user', users);
      }
      // Remove the player from the queue if they were waiting
      playerQueue = playerQueue.filter((playerId) => playerId !== socket.id);
    });
  });

  await app.listen(port);
  // await server.listen(port);
  console.log('Server is running on port ' + port + '.');
  console.log('Access the app at http://localhost:' + port + '/');
}
bootstrap();
