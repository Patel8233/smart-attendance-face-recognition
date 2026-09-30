import { useState } from 'react';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import RegisterFace from './pages/RegisterFace';
import Attendance from './pages/Attendance';
import ClassSessions from './pages/ClassSessions';
import AttendanceHistory from './pages/AttendanceHistory';
import Reports from './pages/Reports';
import Subjects from './pages/Subjects';
import AddSubject from './pages/AddSubject';
import EditStudent from './pages/EditStudent';
import Navbar from './components/Navbar';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');

    setUser(null);
    navigate('/login');
  };

  return (
  <>
    {user && (
      <Navbar
        user={user}
        onLogout={handleLogout}
      />
    )}

    <Routes>
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Login onLogin={handleLogin} />
        }
      />

      <Route
        path="/dashboard"
        element={
          user
            ? (
              <Dashboard user={user} />
            )
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/students"
        element={
          user
            ? <Students />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/students/add"
        element={
          user
            ? <AddStudent />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/students/:id/edit"
        element={
          user
            ? <EditStudent />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/students/:enrollmentNumber/register-face"
        element={
          user
            ? <RegisterFace />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/subjects"
        element={
          user
            ? <Subjects />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/subjects/add"
        element={
          user?.role === 'admin'
            ? <AddSubject />
            : <Navigate to="/subjects" replace />
        }
      />

      <Route
        path="/class-sessions"
        element={
          user
            ? <ClassSessions />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/attendance"
        element={
          user
            ? <Attendance />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/attendance-history"
        element={
          user
            ? <AttendanceHistory />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/reports"
        element={
          user
            ? <Reports />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/"
        element={
          <Navigate
            to={user ? '/dashboard' : '/login'}
            replace
          />
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  </>
);
}

export default App;