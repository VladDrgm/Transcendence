import { Properties } from 'csstype';

export const popupBackgroundStyle: Properties = {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: 'rgba(0, 0, 0, 0.5)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 1000,
	pointerEvents: 'auto'
}

export const popupStyle: Properties = {
	backgroundColor: 'white',
	padding: '20px',
	borderRadius: '8px',
	boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
	pointerEvents: 'auto'
}

export const popupMessageStyle: Properties = {
	color: '#87CEEB',
	textAlign: 'center',
	fontFamily: 'Shlop',
	fontSize: '24px',
}

export const closeButtonStyle: Properties = {
	backgroundColor: '#87CEEB',
	position: 'relative',
	height:'25px',
	width:'50px',
	fontFamily: 'Shlop',
	fontSize: '16px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginBottom: '0px',
}