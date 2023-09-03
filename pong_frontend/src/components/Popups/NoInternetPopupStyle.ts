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
	zIndex: 2000,
	pointerEvents: 'auto'
}

export const popupStyle: Properties = {
	backgroundColor: 'white',
	padding: '20px',
	borderRadius: '8px',
	boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
}

export const popupMessageStyle: Properties = {
	color: 'rgba(254, 8, 16, 1)',
	textAlign: 'center',
	fontFamily: 'Shlop',
	fontSize: '24px',
}
