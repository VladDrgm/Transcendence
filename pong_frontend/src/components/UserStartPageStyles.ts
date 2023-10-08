import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: '#87CEEB',
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
	backgroundColor: '#0071BB',
	color: '#87CEEB'
}

export const buttonStyle: Properties = {
	backgroundColor: 'rgba(255, 215, 0, 0.8)',
	position: 'relative',
	height:'30px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'black',
	top:'1px',
	margin:'4px',
	WebkitTapHighlightColor: 'black',
	// display: 'flex'
}

export const buttonLastStyle: Properties = {
	backgroundColor: '#FFD700',
	position: 'relative',
	height:'30px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'black',
	top:'1px',
	margin:'4px',
	WebkitTapHighlightColor: 'black',
	// display: 'flex'
}