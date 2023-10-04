import React from 'react';
import { useConnectivity } from "../context/ConnectivityContext";
import * as styles from './NoInternetPopupStyle';

const NoInternetPopup: React.FC = () => {
	const { isOnline } = useConnectivity();
  
	if (isOnline) return null;
  
	return (
	  <div style={styles.popupBackgroundStyle}>
		<div style={styles.popupStyle}>
		  <p style={styles.popupMessageStyle}>No Internet Connection. Please check your connection and try again.</p>
		</div>
	  </div>
	);
};

export default NoInternetPopup;