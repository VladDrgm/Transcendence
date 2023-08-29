import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: 'rgba(3, 3, 3, 1)',
	height: '100vh',
	width: '100%',
	position: 'absolute',
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'center',
	borderColor: 'green',
	borderWidth: '5px',
}

export const headerStyle: Properties = {
	height: '40px',
	display:'flex',
	width: '100%',
	justifyContent:'center',
	alignItems: 'center',
}

export const subPageDimensions: Properties = {
	flexGrow: '1',
	width: '100%',
	// height: '100%',
	backgroundColor: 'lightgray'
}

export const buttonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'30px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	top:'1px',
	margin:'4px',
	WebkitTapHighlightColor: 'black',
	// display: 'flex'
}