import { CSSProperties } from "react";

export const LinkStyle: CSSProperties = {
  color: '#FFD700',
}

export const ButtonStyle: CSSProperties = {
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


export const BackButtonStyle: CSSProperties = {
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

export const pageStyle: CSSProperties = {
	backgroundColor: '#0071BB',
  color: '#87CEEB',
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
	border: '3px solid rgba(255, 215, 0, 1)',
  marginBottom: '20px',
}

export const listContainerStyle: CSSProperties = {
	listStyleType: 'none',
	margin: '0px',
	padding: '10px',
	overflow: 'hidden',
	backgroundColor: '#87CEEB',
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
	color: 'black',
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
    color: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

 export const centeredContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  export const profileSectionStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px', // Adjust margin as needed
  };
  
  export const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  export const profileDataContainerStyle: CSSProperties = {
    flex: 1, 
  };