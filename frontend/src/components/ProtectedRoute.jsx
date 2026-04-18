import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/auth.service';

const ProtectedRoute = () => {
  const user = getCurrentUser();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
