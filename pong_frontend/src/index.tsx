import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserContextProvider } from './components/context/UserContext';
import { ConnectivityProvider } from './components/context/ConnectivityContext';
import NoInternetPopup from './components/Popups/NoInternetPopup';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
	<UserContextProvider>
		<ConnectivityProvider>
			<App />
      		<NoInternetPopup />
    	</ConnectivityProvider>
	</UserContextProvider>
  </React.StrictMode>
);