import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import TailMateHomePage from './components/TailMateHomePage';
import Logout from './hooks/Logout';
import UnAuthUserLayout from './components/UnAuthUserLayout';
import AuthUserLayout from './components/AuthUserLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UnAuthUserLayout />}>
          <Route index element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/user" element={<AuthUserLayout />}>
          <Route index element={<TailMateHomePage />} />
          <Route path="logout" element={<Logout />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
