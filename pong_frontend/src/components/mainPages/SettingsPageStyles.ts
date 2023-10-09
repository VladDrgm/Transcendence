import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: '#0071BB',
	height: '1000px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
    color: '#87CEEB',
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
    marginBottom: '15px',
    border: '3px solid rgba(135, 206, 235, 1)',
}

export const customAvatarUploadButtonStyle: Properties = {
    fontSize: '16px',
    textAlign: 'center',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    backgroundColor: '#87CEEB',
    color: '#094074',
    height: '40px',
    width: '250px',
    lineHeight: '40px',

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
	fontFamily: 'Shlop',
	background: '#FFFFE0'
}

export const updateButtonStyle: Properties = {
    display: 'inline-block',
    padding: '8px',
    fontSize: '16px',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
	backgroundColor: '#87CEEB',
    color: '#FFDD4A',
    fontWeight: 550,
	margin: '10px',
	background: 'linear-gradient(45deg, #87CEEB, #0071BB)',
	height:'40px',
	width:'180px',
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
    backgroundColor: '#094074',
    color: '#FFDD4A',
    margin: '50px 200px',
    height: '40px',
    width: '300px',
  };
  
  export const inputContainer: Properties = {
    display: 'flex',
    alignItems: 'center',
  };

  export const uploadContainer: Properties = {
    display: 'flex',
    alignItems: 'center',
  };