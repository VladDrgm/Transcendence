import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: '#0071BB',
	height: '1000px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}

export const userContainer: Properties = {
	display: 'flex',
	alignItems: 'center',
  };
  
  export const tableStyle: Properties = {
	borderCollapse: 'collapse',
	width: '70%',
	marginTop: '20px',
  };
  

  export const profilePicture: Properties = {
	width: '100%',
	height: '100%',
	objectFit: 'cover',
  };
  
  export const circularImage: Properties = {
	width: '40px', 
	height: '40px',
	borderRadius: '50%',
	overflow: 'hidden', 
	marginRight: '10px', 
  };
  
  export const username: Properties = {
	fontSize: '15px',
	color: '#FFD700',
  };

  export const tableCell: Properties = {
	padding: '15px',
	textAlign: 'center',
  };

  export const rowEven: Properties = {
	backgroundColor: 'rgba(0, 0, 0, 0.05)',
  };
  
  export const rowOdd: Properties = {
	backgroundColor: 'rgba(0, 0, 0, 0.1)',
  };

  export const firstRowStyle: Properties = {
	lineHeight: '3', 
	backgroundColor: 'rgba(0, 0, 0, 0.1)', 
	fontWeight: 'bold',
  };