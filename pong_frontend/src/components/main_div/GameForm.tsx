import React, { useState, useEffect } from "react";

interface FormProps {
	joinQueue: () => void;
	startGame: () => void;
	gameSession: {
		playerOne: string | null;
		playerTwo: string | null;
	};
	isConnected: boolean;
}

const GameForm: React.FC<FormProps> = (props) => {
	const [gameSession, setGameSession] = useState<{
		playerOne: string | null;
		playerTwo: string | null;
	}>(props.gameSession);

	useEffect(() => {
		// Update the gameSession state whenever props.gameSession changes
		setGameSession(props.gameSession);
	}, [props.gameSession]);

	const handleStartGameClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		let { playerOne, playerTwo } = props.gameSession;

		if (playerOne && playerTwo) {
			// Both Player 1 and Player 2 are assigned and valid
			props.startGame();
		} else if (!playerTwo) {
				// Player 2 has not joined yet
				alert("Player 2 has not joined yet. Please wait.");
		} else {
			// A user who is not a player tries to start the game
			alert("Join a game first");
		}
	};

	return (
		<form>
			<button onClick={props.joinQueue}>Join Game</button>
			<button onClick={handleStartGameClick}>Start the Game!</button>
		</form>
	);
};

export default GameForm;