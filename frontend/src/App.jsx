import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/recruiter/CreateJob';
import CreateCompany from './pages/recruiter/CreateCompany';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/applications" element={<div>My Applications Placeholder</div>} />

            {/* Recruiter Routes */}
            <Route path="/recruiter/create-job" element={<CreateJob />} />
            <Route path="/recruiter/create-company" element={<CreateCompany />} />
            <Route path="/recruiter/jobs" element={<div>Manage Jobs Placeholder</div>} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
