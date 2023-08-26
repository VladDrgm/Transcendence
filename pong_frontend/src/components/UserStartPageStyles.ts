import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: 'rgba(3, 3, 3, 1)',
	height: '100%',
	width: '100%',
	position: 'absolute',
	alignItems: 'center',
	flexDirection: 'column',
	textAlign: 'center',
	borderColor: 'green',
	borderWidth: '5px',
}

export const headerStyle: Properties = {
	height: '40px',
	width: '100%',
}

export const subPageDimensions: Properties = {
	width: '100%',
	height: '500px',
	backgroundColor: 'lightgray'
}

export const buttonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	top:'4px',
	margin:'4px',
	WebkitTapHighlightColor: 'black',
}