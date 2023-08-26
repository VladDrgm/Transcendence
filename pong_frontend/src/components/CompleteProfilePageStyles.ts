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

export const pageTitleStyle: Properties = {
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
    marginBottom: '4px',
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
	marginBottom: '20px',
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
	marginBottom: '20px',
	fontFamily: 'Shlop',
}

export const completeProfileButtonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'100px',
	fontFamily: 'Shlop',
	fontSize: '14px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginTop: '10px',
	marginLeft: '20px',
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
	marginBottom: '0px',
}