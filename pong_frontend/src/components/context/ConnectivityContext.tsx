import React, { createContext, useContext, useState, useEffect } from 'react';

const ConnectivityContext = createContext<{
  isOnline: boolean;
  setOnline: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOnline: true,
  setOnline: () => {}
});

export const useConnectivity = () => {
  return useContext(ConnectivityContext);
};

interface ConnectivityProviderProps {
	children: React.ReactNode;
  }

export const ConnectivityProvider: React.FC<ConnectivityProviderProps> = ({ children }) => {
  const [isOnline, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isOnline, setOnline }}>
      {children}
    </ConnectivityContext.Provider>
  );
};