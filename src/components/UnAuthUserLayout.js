import { Outlet } from 'react-router-dom';
import FooterComponent from './FooterComponent';
import NavigationBarComponent from './NavigationBarComponent';

const UnAuthUserLayout = () => {

  const links = [];
 
  return (
    <div className="tailmate-page-layout">
      <NavigationBarComponent links={links} />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <FooterComponent />
    </div>
  );
};

export default UnAuthUserLayout;
