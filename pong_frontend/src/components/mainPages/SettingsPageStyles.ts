import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: 'lightgray',
	height: '1000px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}

export const settingsTitleStyle: Properties = {
	color: 'rgba(254, 8, 16, 1)',
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
    border: '3px solid rgba(254, 8, 16, 1)',
}

export const customAvatarUploadButtonStyle: Properties = {
	backgroundColor: 'white',
	color:'black',
	display: 'inline-block',
	padding: '4px',
    width: '140px',
    fontSize: '12px',
    borderRadius: '4px',
	marginBottom: '8px',
	fontFamily: 'Shlop',
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
}

export const updateButtonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	display: 'inline-block',
	height:'40px',
	width:'80px',
	fontFamily: 'Shlop',
	fontSize: '14px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginBottom: '30px',
}

export const logoutButtonStyle: Properties = {
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
	marginTop: '100px',
	marginBottom: '0px',
}