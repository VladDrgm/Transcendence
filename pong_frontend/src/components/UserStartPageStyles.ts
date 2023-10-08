import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: '#0071BB',
	height: '100vh',
	width: '100%',
	position: 'absolute',
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'center',
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
	backgroundColor: '#0071BB',
	color: '#87CEEB'
}

export const buttonStyle: Properties = {
	backgroundColor: '#FFDD4A',
	position: 'relative',
	height:'35px',
	width:'160px',
	fontFamily: 'Comic Sans Ms',
	fontSize: '20px',
	fontWeight: '600',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'#0071BB',
	textDecoration: 'none',
	top:'2px',
	margin:'4px',
	WebkitTapHighlightColor: 'black',
}
