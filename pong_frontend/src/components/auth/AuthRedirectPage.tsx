import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserByToken } from '../../api/userApi';
import { useUserContext } from '../context/UserContext';
import { postUserStatus } from '../../api/statusUpdateAPI.api';

const AuthRedirectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useUserContext();

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        console.error('No token provided.');
        return;
      }

      try {
        const newUser = await getUserByToken(token);

		if (!newUser) {
			console.error('Error fetching user with token');
			navigate('/');
			return;
		}

		localStorage.setItem('user', JSON.stringify(newUser));
		setUser(newUser);

		if (newUser.is2FAEnabled) {
			navigate('/verify-2fa', { replace: true });
		} else {
			if (await postUserStatus("Online", newUser) === true) {
				newUser.status = "Online";
				localStorage.setItem('user', JSON.stringify(newUser));
				setUser(newUser);
			}
			navigate('/', { replace: true });
		}

      } catch (error) {
        console.error('Error fetching user: ', error);
		navigate('/');
      }
    };

    fetchUserAndRedirect();
  }, [navigate, location.search]);

  return null;
};

export default AuthRedirectPage;