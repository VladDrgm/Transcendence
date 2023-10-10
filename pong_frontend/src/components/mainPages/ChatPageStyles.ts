import { Properties } from 'csstype';
import styled from "styled-components";

export const ChatContainerStyle: Properties = {
	backgroundColor: '#0071BB',
	position: 'static',
	flexGrow: '1',
  	width: '70vw',
  	display: 'flex',
	flexDirection: 'row',
	fontFamily: 'Shlop',
	fontSize: '12px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: '2px solid white',
	color:'black',
	marginBottom: '0px',
}

export const ArenaStyle: Properties = {
	backgroundColor: '0071BB',
	position: 'static',
	flexGrow: '1',
	width: '100vw',
	display: 'flex',
	flexDirection: 'row',
	fontFamily: 'Shlop',
	fontSize: '12px',
	alignSelf: 'center',
	color:'white',
	marginBottom: '0px',
}

export const SideBarStyle: Properties = {
	backgroundColor: '#87CEEB',
	height: '100vh',
  	width: '15%',
  	borderRight: '1px solid white',
	color: 'black'
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
  height: 15vh;
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
	backgroundColor: '#FFDD4A',
	position: 'relative',
	fontFamily: 'Shlop',
	fontSize: '13px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: '2px solid',
	color:'#0071BB',
	fontWeight: 550,
	marginTop: '15px',
	marginBottom: '1px',
	padding:'5px',
}

export const PopUpStyle: Properties = {
	backgroundColor: 'black',
	position: 'static',
	flexGrow: '1',
	width: '100vw',
	display: 'flex',
	flexDirection: 'row',
	fontFamily: 'Shlop',
	fontSize: '12px',
	alignSelf: 'center',
	color:'white',
}

export const linkTextStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: 'black',
	fontSize: '14px',
	fontWeight: 600,
	marginTop: '10px',
  };

  export const userButtonStyle: Properties = {
	backgroundColor: '#0071BB',
	borderStyle: 'none',
	cursor: 'pointer',
	color: '#FFDD4A',
	fontSize: '16px',
	fontWeight: 600,
	marginTop: '2px',
	textDecoration: 'underline',
  };

  export const controlsTextStyle: Properties = {
	color: '#FFDD4A',
  };