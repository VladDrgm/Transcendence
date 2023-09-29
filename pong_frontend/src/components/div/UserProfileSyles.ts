import { CSSProperties } from "react";

export const ButtonStyle: CSSProperties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	display: 'inline-block',
	height:'40px',
	width:'150px',
	fontFamily: 'Shlop',
	fontSize: '14px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: '1px solid white',
	color:'white',
	marginBottom: '30px',
    marginTop: '30px',
}

export const pageStyle: CSSProperties = {
	backgroundColor: 'lightgray',
	height: '2500px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}

export const profilePictureStyle: CSSProperties = {
	width: '120px',
	height: '120px',
	borderRadius: '50%',
	objectFit: 'cover',
	border: '3px solid rgba(254, 8, 16, 1)',
    marginBottom: '20px',
}

export const listContainerStyle: CSSProperties = {
	listStyleType: 'none',
	margin: '0px',
	padding: '10px',
	overflow: 'hidden',
	backgroundColor: '#333333',
	borderRadius: '12px',
	width: '500px',
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center',
}

export const listStyle: CSSProperties = {
	float: 'left',
}

export const statListItemStyle: CSSProperties = {
	display: 'block',
	color: 'white',
	textAlign: 'center',
	paddingLeft: '50px',
	paddingTop: '5px',
	paddingRight: '50px',
	paddingBottom: '5px',
	textDecoration: 'none',
}

export const achievementListItemStyle: CSSProperties = {
	position: 'relative',
	padding: '24px',
	width:'60px',
	height:'60px', 
}

export const achievementTextStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

 export const centeredContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
