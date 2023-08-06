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
			alert("Session not ready.");
		} 
	};

	return (
		<>
			<form>
				<button onClick={props.joinQueue}>Join Game</button>
				<button onClick={handleStartGameClick}>Start the Game!</button>
			</form>
			<p>Controls: W - UP, S - Down, R - Change Map, P - PowerUp: Increase Gravity!</p>
		</>
	);
};

export default GameForm;