import { Properties } from 'csstype';
import styled from "styled-components";

export const exampleStyle: Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '8px',
	padding: '4px',
	fontFamily: 'Shlop',
	fontSize: '40px',
}

export const Container = styled.div`
  height: 100vh;
  width: 50%;
  display: flex;
  border: '2px solid',
	color:'white',
`;

export const ChatContainerStyle: Properties = {
	backgroundColor: 'gray',
	position: 'static',
	height: '100vh',
  	width: '100vh',
  	display: 'flex',
	fontFamily: 'Shlop',
	fontSize: '12px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: '2px solid',
	color:'white',
	// marginTop: '100px',
	marginBottom: '0px',
}

export const SideBar = styled.div`
  height: 100%;
  width: 15%;
  border-right: 1px solid black;
`;

export const ChatPanel = styled.div`
  height: 50%;
  width: 85%;
  display: flex;
  flex-direction: column;
`;

export const BodyContainer = styled.div`
  width: 100%;
  height: 75%;
  overflow: scroll;
  border-bottom: 1px solid black;
`;

export const TextBox = styled.textarea`
  height: 15%;
  width: 100%;
`;

export const ChannelInfo = styled.div`
  height: 10%;
  width: 100%;
  border-bottom: 1px solid black;
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
	fontSize: '12px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: '2px solid',
	color:'white',
	// marginTop: '100px',
	marginBottom: '0px',
}

/* Usage:
import * as styles from './ChatPageStyles';

<p style={styles.exampleStyle}>Welcome</p>
*/