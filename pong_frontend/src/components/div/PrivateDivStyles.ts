import { Properties } from 'csstype';

export const profilePictureStyle: Properties = {
	width: '120px',
	height: '120px',
	borderRadius: '50%',
	objectFit: 'cover',
	border: '3px solid rgba(135, 206, 235, 1)',
}

export const listContainerStyle: Properties = {
	listStyleType: 'none',
	margin: '0px',
	padding: '0px',
	overflow: 'hidden',
	backgroundColor: '#87CEEB',
	borderRadius: '12px',
	width: '500px',
	color: '#FFDD4A'
}

export const listStyle: Properties = {
	float: 'left',
}

export const statListItemStyle: Properties = {
	display: 'block',
	color: '#0071BB',
	fontWeight: 550,
	textAlign: 'center',
	paddingLeft: '50px',
	paddingTop: '5px',
	paddingRight: '50px',
	paddingBottom: '5px',
	textDecoration: 'none',
}

export const achievementListItemStyle: Properties = {
	position: 'relative',
	padding: '24px',
	width:'60px',
	height:'60px', 
}