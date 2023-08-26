import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: 'lightgray',
	height: '2500px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}

export const profilePictureStyle: Properties = {
	width: '120px',
	height: '120px',
	borderRadius: '50%',
	objectFit: 'cover',
	marginBottom: '20px',
	border: '3px solid rgba(254, 8, 16, 1)',
}

export const statListContainerStyle: Properties = {
	listStyleType: 'none',
	margin: '0px',
	padding: '0px',
	overflow: 'hidden',
	backgroundColor: '#333333',
	borderRadius: '12px',
	width: '500px',
}

export const statListStyle: Properties = {
	float: 'left',
}

export const statListItemStyle: Properties = {
	display: 'block',
	color: 'white',
	textAlign: 'center',
	paddingLeft: '50px',
	paddingTop: '5px',
	paddingRight: '50px',
	paddingBottom: '5px',
	textDecoration: 'none',
}