import { Link, useNavigate } from 'react-router-dom';
import { LogOut, FileText, Home } from 'lucide-react';
import { logout, getCurrentUser } from '../../services/auth.service';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">HireHub</Link>
          </div>
          
          <div className="flex items-center space-x-8 text-sm font-medium">
            <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Home className="h-5 w-5 mr-1" /> Home
            </Link>

            {user?.role === 'JOB_SEEKER' && (
              <Link to="/applications" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <FileText className="h-5 w-5 mr-1" /> My Apps
              </Link>
            )}

            {user?.role === 'RECRUITER' && (
              <>
                <Link to="/recruiter/jobs" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <Briefcase className="h-5 w-5 mr-1" /> Manage Jobs
                </Link>
                <Link 
                  to="/recruiter/create-job" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post a Job
                </Link>
              </>
            )}
            
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Hi, {user?.name?.split(' ')[0]}</span>
              <button 
                onClick={handleLogout} 
                className="flex items-center text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
