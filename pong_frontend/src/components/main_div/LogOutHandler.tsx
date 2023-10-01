import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUserStatus } from '../../api/statusUpdateAPI.api';

interface LogoutHandlerProps
{
	onLogout: () => void;
}
const LogoutHandler = ({ onLogout }: LogoutHandlerProps)  => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const localUser = localStorage.getItem('user');
      const localParsedUser = JSON.parse(localUser!);
      if (localParsedUser != null) {
        await postUserStatus('Offline', localParsedUser);
      }
      localStorage.removeItem('user');
      onLogout(); 
      navigate('/login');
    };

    handleLogout();
  }, [navigate, onLogout]);

  return null;
};

export default LogoutHandler;
