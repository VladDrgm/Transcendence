
require('dotenv').config();
if (process.env) {
  console.log('The process.env object is available');
} else {
  console.log('The process.env object is not available');
}


const fetchAddress = process.env.REACT_APP_SRVR_URL || 'http://localhost:3000/';

console.log(fetchAddress);