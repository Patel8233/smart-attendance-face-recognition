import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ClassSessions() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSubject, setSelectedSubject] =
    useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token =
          sessionStorage.getItem('accessToken');

        const response = await fetch(
          'http://localhost:3000/api/subjects',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || 'Failed to load subjects',
          );
          return;
        }

        setSubjects(data);
      } catch {
        setError('Unable to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);
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
        console.error(
          data.message || 'Failed to load sessions',
        );
        return;
      }

      setSessions(data);
    } catch (error) {
      console.error(
        'Unable to load class sessions',
        error,
      );
    }
  };

  fetchSessions();
}, []);
const handleStartSession = async () => {
  if (!selectedSubject) {
    alert('Please select a subject');
    return;
  }

  try {
    const token =
      sessionStorage.getItem('accessToken');

    const response = await fetch(
      'http://localhost:3000/api/class-sessions',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          subjectCode: selectedSubject,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Failed to start session',
      );

      return;
    }

    alert('Class session started successfully');

    navigate('/attendance');
  } catch (error) {
    console.error(error);

    alert('Unable to connect to backend');
  }
};
const handleEndSession = async (sessionId) => {
  const confirmEnd = window.confirm(
    'Are you sure you want to end this class session?',
  );

  if (!confirmEnd) {
    return;
  }

  try {
    const token =
      sessionStorage.getItem('accessToken');

    const response = await fetch(
      `http://localhost:3000/api/class-sessions/${sessionId}/end`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Failed to end session',
      );

      return;
    }

    alert('Class session ended successfully');

    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session._id === sessionId
          ? {
              ...session,
              active: false,
              endTime: data.endTime,
            }
          : session,
      ),
    );
  } catch (error) {
    console.error(error);
    alert('Unable to connect to backend');
  }
};
  return (
  <div className="page-container">
    <div className="session-header">
      <div>
        <h1>Class Sessions</h1>

        <p className="form-subtitle">
          Start a class session and manage active attendance sessions.
        </p>
      </div>
    </div>

    <div className="session-start-box">
      <h2>Start New Session</h2>

      {loading && <p>Loading subjects...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="session-start-form">
          <div className="form-group">
            <label>Select Subject</label>

            <select
              value={selectedSubject}
              onChange={(e) =>
                setSelectedSubject(e.target.value)
              }
            >
              <option value="">
                Select Subject
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject._id}
                  value={subject.code}
                >
                  {subject.name} - {subject.code}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStartSession}
            disabled={!selectedSubject}
          >
            Start Session
          </button>
        </div>
      )}
    </div>

    <div className="active-sessions-section">
      <h2>Active Sessions</h2>

      {sessions.filter((session) => session.active).length === 0 ? (
        <div className="empty-session">
          <p>No active sessions currently.</p>
        </div>
      ) : (
        <div className="sessions-grid">
          {sessions
            .filter((session) => session.active)
            .map((session) => (
              <div
                className="session-card"
                key={session._id}
              >
                <div className="session-card-header">
                  <div>
                    <h3>{session.subjectName}</h3>

                    <span className="session-code">
                      {session.subjectCode}
                    </span>
                  </div>

                  <span className="status-active">
                    Active
                  </span>
                </div>

                <div className="session-details">
                  <p>
                    <strong>Date:</strong>{' '}
                    {session.date}
                  </p>

                  <p>
                    <strong>Start Time:</strong>{' '}
                    {session.startTime}
                  </p>
                </div>

                <button
                  className="end-session-button"
                  onClick={() =>
                    handleEndSession(session._id)
                  }
                >
                  End Session
                </button>
              </div>
            ))}
        </div>
      )}
    </div>

    <button
      className="secondary-button"
      onClick={() => navigate('/dashboard')}
    >
      Back to Dashboard
    </button>
  </div>
);
}

export default ClassSessions;