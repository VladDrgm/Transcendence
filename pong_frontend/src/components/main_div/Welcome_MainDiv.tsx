import React from 'react';

interface WelcomeProps
{
  userID: number;
}

const Welcome_MainDiv: React.FC<WelcomeProps> = ({userID}) => {
    return (<div>
                <p>Welcome {userID} to the Pong Palace, where the paddles are quick and the competition is fierce! Whether you're a seasoned pro or a newcomer to the game, you're sure to have a ball (or two) playing our addictive version of this classic game. So grab your paddle, put on your game face, and get ready to smash some balls and make some friends. Let's play some Pong!</p>
            </div>)
};

export default Welcome_MainDiv;
