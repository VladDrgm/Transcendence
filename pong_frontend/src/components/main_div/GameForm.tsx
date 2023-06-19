import React, { ChangeEvent } from "react";

interface FormProps {
	registerPlayerOne: () => void;
	registerPlayerTwo: () => void;
	registerAudience: () => void;
	startGame: () => void;
}

const Form: React.FC<FormProps> = (props) => {
  return (
    <form>
      <button onClick={props.registerPlayerOne}>Register as Player 1</button>
	  <button onClick={props.registerPlayerTwo}>Register as Player 2</button>
	  <button onClick={props.registerAudience}>Register as Audience</button>
	  <button onClick={props.startGame}>Start the Game!</button>
    </form>
  );
};

export default Form;