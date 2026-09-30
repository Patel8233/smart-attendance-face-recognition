import { NavLink } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">SA</div>

        <div>
          <h3>Smart Attendance</h3>
          <span>{user?.role}</span>
        </div>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/students">
          Students
        </NavLink>

        <NavLink to="/subjects">
          Subjects
        </NavLink>

        <NavLink to="/class-sessions">
          Sessions
        </NavLink>

        <NavLink to="/attendance">
          Face Attendance
        </NavLink>

        <NavLink to="/attendance-history">
          History
        </NavLink>

        <NavLink to="/reports">
          Reports
        </NavLink>
      </div>

      <div className="navbar-user">
        <span>{user?.name}</span>

        <button
          className="navbar-logout"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;