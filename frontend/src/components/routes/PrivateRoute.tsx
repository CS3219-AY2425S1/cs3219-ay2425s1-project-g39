import React, { ComponentType } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  Component?: ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ Component }) => {

  const token = localStorage.getItem('token');

  if (!token) {
    console.log('Redirecting to login');
    return <Navigate to="/?login=true" />;
  }

  return Component ? <Component /> : <Outlet />;
};

export default PrivateRoute;
