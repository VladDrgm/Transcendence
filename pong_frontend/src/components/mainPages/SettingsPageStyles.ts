import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: '#0071BB',
	height: '1000px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}

export const settingsTitleStyle: Properties = {
	color: '#87CEEB',
	position: 'relative',
	textAlign: 'center',
	top: '8px',
	padding: '4px',
	fontFamily: 'Shlop',
	fontSize: '40px',
}

export const profilePictureStyle: Properties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    border: '3px solid #0071BB',
}

export const customAvatarUploadButtonStyle: Properties = {
    display: 'inline-block',
    padding: '12px 20px',
    fontSize: '16px',
    textAlign: 'center',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
	backgroundColor: '#87CEEB',
    color: '#000000',
	height:'40px',
	width:'150px',
}

export const imageUploadButtonIconStyle: Properties = {
    display: 'inline-block',
	paddingRight: '3px',
	verticalAlign: 'middle',
	height: '16px',
	width: '16px',
}

export const avatarInputFieldStyle: Properties = {
	display: 'none',
}

export const formFieldStyle: Properties = {
    padding: '8px',
    width: '250px',
    fontSize: '18px',
    borderRadius: '4px',
    border: '1px solid #fff',
	marginBottom: '8px',
	fontFamily: 'Shlop',
	background: '#FFFFE0'
}

export const updateButtonStyle: Properties = {
    display: 'inline-block',
    padding: '12px 20px',
    fontSize: '16px',
    textAlign: 'center',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
	backgroundColor: '#87CEEB',
    color: '#000000',
	margin: '10px 100px',
	background: 'linear-gradient(45deg, #87CEEB, #0071BB)',
	height:'40px',
	width:'150px',
}

export const logoutButtonStyle: Properties = {
    display: 'inline-block',
    padding: '12px 20px',
    fontSize: '16px',
    textAlign: 'center',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
	backgroundColor: '#87CEEB',
    color: '#000000',
	margin: '50px 200px',
	background: 'linear-gradient(45deg, #BF94E4, #6F44D1)',
	height:'40px',
	width:'300px',
}