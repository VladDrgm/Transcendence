import { Properties } from 'csstype';
import styled from "styled-components";

export const ChatContainerStyle: Properties = {
	backgroundColor: 'lightgray',
	position: 'static',
	flexGrow: '1',
	// height: '100%',
  	width: '70vw',
  	display: 'flex',
	flexDirection: 'row',
	fontFamily: 'Shlop',
	fontSize: '12px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: '2px solid white',
	color:'black',
	// marginTop: '100px',
	marginBottom: '0px',
}

export const ArenaStyle: Properties = {
	backgroundColor: 'lightgray',
	position: 'static',
	flexGrow: '1',
	// height: '100vh',
	width: '100vw',
	display: 'flex',
	flexDirection: 'row',
	fontFamily: 'Shlop',
	fontSize: '12px',
	alignSelf: 'center',
	// borderRadius: '6px',
	// border: '2px solid',
	color:'white',
	// marginTop: '100px',
	marginBottom: '0px',
}

export const SideBarStyle: Properties = {
	backgroundColor: 'black',
	height: '100vh',
  	width: '15%',
  	borderRight: '1px solid white',
	color: 'white'
}

export const ChatPanel = styled.div`
  height: 100vh;
  width: 85%;
  display: flex;
  flex-direction: column;
`;

export const BodyContainer = styled.div`
  width: 100%;
  height: 75%;
  overflow: scroll;
//   display: flex;

//   border-bottom: 1px solid black;
`;

export const TextBox = styled.textarea`
  height: 10%;
  width: 99%;
`;

export const ChannelInfo = styled.div`
  height: 15%;
  width: 100%;
//   border-bottom: 1px solid black;
`;

export const Row = styled.div`
  cursor: pointer;
`;

export const Messages = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const chatButtonsStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	// height:'40px',
	// width:'160px',
	fontFamily: 'Shlop',
	fontSize: '13px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: '2px solid',
	color:'white',
	marginTop: '15px',
	marginBottom: '1px',
	padding:'5px',
}

export const PopUpStyle: Properties = {
	backgroundColor: 'black',
	position: 'static',
	flexGrow: '1',
	// height: '100vh',
	width: '100vw',
	display: 'flex',
	flexDirection: 'row',
	fontFamily: 'Shlop',
	fontSize: '12px',
	alignSelf: 'center',
	// borderRadius: '6px',
	// border: '2px solid',
	color:'white',
	// marginTop: '100px',
	// marginBottom: '0px',
}

export const linkTextStyle = {
	display: 'flex',
	// flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	color: 'white',
	fontSize: '14px',
	fontWeight: 600,
	marginTop: '10px',
  };

  export const userButtonStyle: Properties = {
	backgroundColor: 'lightgray',
	borderStyle: 'none',
	cursor: 'pointer',
	color: 'white',
	fontSize: '16px',
	fontWeight: 600,
	marginTop: '3px',
	textDecoration: 'underline',
  };
