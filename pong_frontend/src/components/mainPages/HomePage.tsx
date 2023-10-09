import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePageHorrorStyles.css';


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
      <h1 className="game-title">Horror Pong</h1>

      {/* Fog Layers */}
      <div id="foglayer_01" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div>
      <div id="foglayer_02" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div>
      <div id="foglayer_03" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div>

      {/* Custom Cursor */}
      <div className="custom-cursor"></div>
    </div>
  );
};

export default HomePage;
