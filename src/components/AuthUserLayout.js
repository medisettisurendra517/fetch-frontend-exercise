import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import FooterComponent from './FooterComponent'; 
import NavigationBarComponent from './NavigationBarComponent'; 
import FetchApi from '../api/fetchapi';
import LocalApi from '../api/localapi';

const AuthUserLayout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const links = [
    { to: '/user', label: 'Home' },
    { to: '/user/logout', label: 'Logout' },
  ];

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await FetchApi.allBreedNames(); 
        console.log('Response:', response);
        if(response.status === 200){
            setIsLoggedIn(true); 
        }
     
      } catch (error) {
        LocalApi.clearUserInfo();
        navigate('/', { replace: true }); 
        alert('Failed to authenticate. Please Re-Login to continue. if still issue exists try enabling third party cookies.')
      }
    };

    checkLoginStatus();
  }, [navigate]); 

  if (!isLoggedIn) {
    return null; 
  }

  return (
    <div className="main-layout">
      <NavigationBarComponent links={links} />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <FooterComponent />
    </div>
  );
};

export default AuthUserLayout;
