import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: 'lightgray',
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
	width: '70%', // Adjust the width as needed
	marginTop: '20px', // Add spacing from the top
  };
  

  export const profilePicture: Properties = {
	width: '100%',
	height: '100%',
	objectFit: 'cover', // Adjust the image fit as needed
  };
  
  export const circularImage: Properties = {
	width: '40px', // Adjust the size of the circular image
	height: '40px',
	borderRadius: '50%', // Creates a circular shape
	overflow: 'hidden', // Ensures the image stays within the circular shape
	marginRight: '10px', // Add spacing between the image and username
  };
  
  export const username: Properties = {
	fontSize: '15px', // Adjust the font size of the username
  };

  export const tableCell: Properties = {
	padding: '15px', // Adjust the cell padding to control spacing
	textAlign: 'center', // Align cell content to the left
  };

  export const rowEven: Properties = {
	backgroundColor: 'rgba(0, 0, 0, 0.05)', // Adjust the background color as needed
  };
  
  export const rowOdd: Properties = {
	backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the background color as needed
  };

  export const firstRowStyle: Properties = {
	lineHeight: '3', 
		backgroundColor: 'rgba(0, 0, 0, 0.1)', // Background color for the first row
	// color: 'rgba(254, 8, 16, 1)', // Text color for the first row
	fontWeight: 'bold', // Make the text bold for the first row
  };