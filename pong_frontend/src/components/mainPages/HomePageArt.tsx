import React from 'react';
import './HomePageAmongUsStyles.css';


const Character = () => {
  return (
    <div>
      <div className="body">
        <div className="body-light-part"></div>
        <div className="face">
          <div className="face-light-part">
            <div className="shimmer"></div>
          </div>
        </div>
        <div className="backpack">
          <div className="backpack-light-part"></div>
        </div>
        <div className="leg-left-under"></div>
        <div className="leg-left"></div>
        <div className="leg-right-under"></div>
        <div className="leg-right"></div>
      </div>
    </div>
  );
};

const OppositeFacingCharacter = () => {
  return (
    <div>
      <div className="body">
        <div className="body-light-part"></div>
        <div className="face">
          <div className="face-light-part">
            <div className="shimmer"></div>
          </div>
        </div>
        <div className="backpack">
          <div className="backpack-light-part"></div>
        </div>
        <div className="leg-left-under"></div>
        <div className="leg-left"></div>
        <div className="leg-right-under"></div>
        <div className="leg-right"></div>
      </div>
    </div>
  );
};


function Art() {
    return (
      <div className="characters-container">
        <div className="character-left">
        <OppositeFacingCharacter/>
        </div>
        <div className="ball"></div> {/* Ball in the middle */}
        <div className="character-right">
          <Character/>
        </div>
      </div>
    );
  };

export default Art;