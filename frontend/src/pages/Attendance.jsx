import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Attendance() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] =
    useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token =
          sessionStorage.getItem('accessToken');

        const response = await fetch(
          'http://localhost:3000/api/class-sessions',
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
              'Failed to load class sessions',
          );
          return;
        }

        setSessions(data);
      } catch {
        setError('Unable to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const activeSessions = sessions.filter(
    (session) => session.active,
  );
  const handleRecognizeAttendance = async () => {
  if (!selectedSession) {
    alert('Please select a class session');
    return;
  }

  if (!image) {
    alert('Please select a face image');
    return;
  }

  try {
    const token =
      sessionStorage.getItem('accessToken');

    const formData = new FormData();

    formData.append('file', image);
    formData.append('sessionId', selectedSession);

    const response = await fetch(
      'http://localhost:3000/api/attendance/recognize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message ||
            'Attendance marking failed',
      );

      return;
    }

    alert(
      `Attendance marked successfully for ${
        data.studentName ||
        data.enrollmentNumber
      }`,
    );

    setImage(null);
  } catch (error) {
    console.error(error);

    alert('Unable to connect to backend');
  }
};

  return (
  <div className="page-container">
    <div className="attendance-header">
      <h1>Face Recognition Attendance</h1>

      <p className="form-subtitle">
        Select an active class session and upload a student face image
        to mark attendance.
      </p>
    </div>

    <div className="attendance-box">
      <h2>Select Active Class Session</h2>

      {loading && <p>Loading sessions...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {activeSessions.length === 0 ? (
            <div className="empty-session">
              <p>No active class session found.</p>

              <button
                type="button"
                onClick={() => navigate('/class-sessions')}
              >
                Start Class Session
              </button>
            </div>
          ) : (
            <div className="form-group">
              <label>Class Session</label>

              <select
                value={selectedSession}
                onChange={(e) =>
                  setSelectedSession(e.target.value)
                }
              >
                <option value="">
                  Select Class Session
                </option>

                {activeSessions.map((session) => (
                  <option
                    key={session._id}
                    value={session._id}
                  >
                    {session.subjectName} - {session.subjectCode}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>

    {selectedSession && (
      <div className="attendance-box">
        <h2>Recognize Student Face</h2>

        <p className="attendance-help-text">
          Select a clear image of the registered student.
        </p>

        <div className="form-group">
          <label>Student Face Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files[0] || null)
            }
          />
        </div>

        {image && (
          <div className="selected-image-box">
            <p>
              Selected Image:
              <strong> {image.name}</strong>
            </p>
          </div>
        )}

        <button
          onClick={handleRecognizeAttendance}
          disabled={!image}
        >
          Recognize & Mark Attendance
        </button>

        <p className="privacy-note">
          Use face images only for students who have agreed to
          participate in the attendance system.
        </p>
      </div>
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

export default Attendance;