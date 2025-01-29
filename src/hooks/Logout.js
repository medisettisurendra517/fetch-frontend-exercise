import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import LocalApi from "../api/localapi";
import FetchApi from "../api/fetchapi";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        FetchApi.logoutUser();
        LocalApi.clearUserInfo();
        navigate('/', { replace: true });
    }, [navigate]);

    return null;
}
export default Logout;