import { useNavigate } from 'react-router-dom';

function Dashboard({ user })  {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Smart Attendance Dashboard</h1>

        <h2>Welcome, {user.name}</h2>

        <p>
          Role: <strong>{user.role}</strong>
        </p>
      </div>

      <div className="dashboard-grid">
        <div
          className="dashboard-card"
          onClick={() => navigate('/students')}
        >
          <h3>Students</h3>
          <p>
            Add, edit, manage and register student faces.
          </p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate('/subjects')}
        >
          <h3>Subjects</h3>
          <p>
            View and manage subjects.
          </p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate('/class-sessions')}
        >
          <h3>Class Sessions</h3>
          <p>
            Start and end attendance sessions.
          </p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate('/attendance')}
        >
          <h3>Face Attendance</h3>
          <p>
            Mark attendance using face recognition.
          </p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate('/attendance-history')}
        >
          <h3>Attendance History</h3>
          <p>
            View previously marked attendance.
          </p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate('/reports')}
        >
          <h3>Reports</h3>
          <p>
            Check student attendance reports.
          </p>
        </div>
      </div>

      
    </div>
  );
}

export default Dashboard;