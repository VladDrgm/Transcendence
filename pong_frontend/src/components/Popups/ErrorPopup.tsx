import React from 'react';
import * as styles from './ErrorPopupStyle';

const ErrorPopup: React.FC<{ message: string | null, onClose: () => void }> = ({ message, onClose }) => {
	if (!message) return null;
	return (
		<div style={styles.popupBackgroundStyle}>
			<div style={styles.popupStyle}>
				<p style={styles.popupMessageStyle}>{message}</p>
				<button style={styles.closeButtonStyle} onClick={onClose}>Close</button>
			</div>
		</div>
	);
}

export default ErrorPopup;