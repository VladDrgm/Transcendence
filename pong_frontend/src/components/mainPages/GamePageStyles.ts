import { Properties } from 'csstype';

export const exampleStyle: Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '8px',
	padding: '4px',
	fontFamily: 'Shlop',
	fontSize: '40px',
}

export const GameContainerStyle: Properties = {
	// backgroundColor: 'gray',
	// flex: '1',
	position: 'relative',
	// height: '100vh',
  	width: '50%',
  	// display: 'flex',
	fontFamily: 'Shlop',
	fontSize: '12px',
	alignSelf: 'center',
	borderRadius: '6px',
	// border: '2px solid',
	color:'red',
	// marginTop: '100px',
	marginBottom: '0px',
}

/* Usage:
import * as styles from './ProfilePageStyles';

<p style={styles.formFieldStyle}>Welcome</p>
*/