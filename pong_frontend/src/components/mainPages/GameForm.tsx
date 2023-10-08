import React from "react";
import { chatButtonsStyle, controlsTextStyle } from "./ChatPageStyles";

interface FormProps {
	joinQueue: () => void;
	startGame: () => void;
	quitGame: () => void;
	gameSession: {
		playerOne: string | null;
		playerTwo: string | null;
	};
	isConnected: boolean;
}

const GameForm: React.FC<FormProps> = (props) => {
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

	const handleQuitGameClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		props.quitGame();
	};

	return (
		<>
			<form>
				<button style={chatButtonsStyle} onClick={props.joinQueue}>Join Game</button>
				<button style={chatButtonsStyle} onClick={handleStartGameClick}>Start the Game!</button>
				<button style={chatButtonsStyle} onClick={handleQuitGameClick}>Quit Game/Session</button>
			</form>
			<p style={controlsTextStyle}>Controls: W - UP, S - Down, R - Change Map, P - PowerUp: Increase Gravity!</p>
		</>
	);
};

export default GameForm;