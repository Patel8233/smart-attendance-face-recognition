import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AttendanceHistory() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token =
          sessionStorage.getItem('accessToken');

        const response = await fetch(
          'http://localhost:3000/api/attendance',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              'Failed to load attendance',
          );
          return;
        }

        setRecords(data);
      } catch (error) {
        console.error(error);

        setError(
          'Unable to connect to backend',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
  <div className="page-container">
    <div className="history-header">
      <h1>Attendance History</h1>

      <p className="form-subtitle">
        View all previously marked student attendance records.
      </p>
    </div>

    {loading && (
      <p>Loading attendance...</p>
    )}

    {error && (
      <p className="error-message">
        {error}
      </p>
    )}

    {!loading && !error && (
      <>
        {records.length === 0 ? (
          <div className="empty-session">
            <p>No attendance records found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Enrollment</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Marked By</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <strong>
                        {record.studentName}
                      </strong>
                    </td>

                    <td>
                      {record.enrollmentNumber}
                    </td>

                    <td>
                      {record.subjectName}
                      <br />
                      <span className="table-subtext">
                        {record.subjectCode}
                      </span>
                    </td>

                    <td>{record.date}</td>

                    <td>{record.time}</td>

                    <td>
                      <span className="attendance-status">
                        {record.status}
                      </span>
                    </td>

                    <td>{record.markedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    )}

    <button
      className="secondary-button"
      onClick={() => navigate('/dashboard')}
    >
      Back to Dashboard
    </button>
  </div>
);
}

export default AttendanceHistory;