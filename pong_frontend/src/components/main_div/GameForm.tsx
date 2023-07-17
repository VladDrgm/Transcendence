import React from "react";

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
	const handleStartGameClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (props.gameSession.playerTwo) {
			if (props.gameSession.playerOne === props.gameSession.playerTwo) {
				// Both players are assigned and the current browser is player 1
				props.startGame();
			} else {
				// Player 2 clicked "Start Game"
				alert("Please wait for Player One to start the game.");
			}
			} else {
				// Player 1 clicked "Start Game" but player 2 hasn't joined yet
				alert("Player 2 has not joined yet. Please wait.");
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