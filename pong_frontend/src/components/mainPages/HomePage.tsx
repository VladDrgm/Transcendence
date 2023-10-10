
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Art from './HomePageArt'


const HomePage: React.FC = () => {
  const [isFogVisible, setFogVisible] = useState(true);
  const navigate = useNavigate();

  // Function to toggle fog visibility
  const toggleFog = () => {
    setFogVisible(!isFogVisible);
  };

  useEffect(() => {
	// Check if the user is logged in when the component mounts
	const localUser = localStorage.getItem('user');
	const localParsedUser = JSON.parse(localUser!);
	if (!localParsedUser) {
	  navigate('/login'); // Redirect to the login page if not logged in
	}
}, [navigate]);

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
