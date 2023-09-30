import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: 'rgba(3, 3, 3, 1)',
	height: '100%',
	width: '100%',
	position: 'absolute',
	alignItems: 'center',
	flexDirection: 'column',
	textAlign: 'center',
	justifyContent: 'center',
	left: 0,
	right: 0,
	margin: 0,
	display: 'flex',
}

export const gifStyle: Properties = {
	position: 'relative',
	top: '40px',
	padding: '24px',
	width:'360px',
	height:'360px', 
  };

export const welcomeTitleStyle: Properties = {
  color: 'rgba(254, 8, 16, 1)',
  position: 'relative',
  textAlign: 'center',
  top: '8px',
  padding: '4px',
  fontFamily: 'Shlop',
  fontSize: '80px',
};

export const loginButtonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	display: 'block',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginBottom: '20px',
}

export const signupButtonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'50px',
	width:'180px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	display: 'block',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginBottom: '20px',
}

export const loginPopupStyle: Properties = {
    position: 'fixed',
    top: '60%',
    left: '50%',
	height: '40%',
	width: '40%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'rgba(3, 3, 3, 1)',
    boxShadow: '0 2px 20px rgba(255, 255, 255, 1)',
	borderRadius: '4px',
    border: '1px solid #fff',
    zIndex: 9999,
}

export const signupPopupStyle: Properties = {
    position: 'fixed',
    top: '60%',
    left: '50%',
	height: '40%',
	width: '40%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'rgba(3, 3, 3, 1)',
    boxShadow: '0 2px 20px rgba(255, 255, 255, 1)',
	borderRadius: '4px',
    border: '1px solid #fff',
    zIndex: 9999,
}

export const popUpTitleStyle: Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	fontFamily: 'Shlop',
	fontSize: '50px',
  };

export const popUpLoginButtonStyle: Properties = {
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
	marginTop: '20px',
}

export const popUpSignupButtonStyle: Properties = {
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
	marginTop: '10px',
}

export const formFieldStyle: Properties = {
    padding: '8px',
    width: '200px',
    fontSize: '18px',
    borderRadius: '4px',
    border: '1px solid #fff',
	marginBottom: '13px',
	fontFamily: 'Shlop',
}