import React, { ComponentType } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
  Component?: ComponentType;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ Component }) => {
  const token = localStorage.getItem('token');

  if (token) {
    console.log('Redirecting to dashboard');
    return <Navigate to="/dashboard" />;
  }

  return Component ? <Component /> : <Outlet />;
};

export default PublicRoute;
