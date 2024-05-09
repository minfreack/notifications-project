'use client'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth/index';
import { useNavigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }: any) => {
  const navigate = useNavigate();

  const { userAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const pathname = useLocation().pathname;
  
  useEffect(() => {
    const checkAuthentication = async () => {      
      //@ts-ignore
      if (!userAuth?.auth?.uid) {        
        if(pathname === '/login' || pathname === '/register') {
            setLoading(false);
            return;
        }        
        if(pathname?.includes('/dashboard') || pathname?.includes('/')) {                    
            await navigate('/login');
            setLoading(false);
            return;
        }
      } else if (pathname === '/login' || pathname === '/register') {
        await navigate('/dashboard');
        setLoading(false); 
      }
      setLoading(false); 
    };

    checkAuthentication();
  }, [userAuth, pathname]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <>{children}</>
  );
};

export default PrivateRoute;
