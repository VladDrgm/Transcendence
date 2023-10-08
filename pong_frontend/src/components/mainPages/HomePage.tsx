import React, { useState } from 'react';
import Art from './HomePageArt'


const HomePage: React.FC = () => {
  const [isFogVisible, setFogVisible] = useState(true);

  // Function to toggle fog visibility
  const toggleFog = () => {
    setFogVisible(!isFogVisible);
  };

  return (
    <div className={`horror-pong-homepage ${isFogVisible ? 'fog-visible' : ''}`} onClick={toggleFog}>
      {/* Title */}
      <h1 className="game-title" style={{ color: '#87CEEB', display: 'inline-block', marginRight: '10px' }}>Among Pong</h1>
      {/* Fog Layers */}
      <Art />

      {/* Custom Cursor */}
      <div className="custom-cursor"></div>
    </div>
  );
};

export default HomePage;
