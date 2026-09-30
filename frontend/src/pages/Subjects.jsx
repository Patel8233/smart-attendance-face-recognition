import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Subjects() {
  const navigate = useNavigate();
  const user = JSON.parse(
  sessionStorage.getItem('user'),
);

  const [subjects, setSubjects] = useState([]);
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
      } catch (error) {
        console.error(error);
        setError('Unable to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

 return (
  <div className="page-container">
    <div className="students-header">
      <div>
        <h1>Subject Management</h1>

        <p className="form-subtitle">
          View and manage subjects for attendance sessions.
        </p>
      </div>

      {user?.role === 'admin' && (
        <button
          onClick={() => navigate('/subjects/add')}
        >
          + Add Subject
        </button>
      )}
    </div>

    {loading && <p>Loading subjects...</p>}

    {error && <p>{error}</p>}

    {!loading && !error && (
      <>
        {subjects.length === 0 ? (
          <p>No subjects found.</p>
        ) : (
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <div
                className="subject-card"
                key={subject._id}
              >
                <div className="subject-card-header">
                  <h3>{subject.name}</h3>

                  <span
                    className={
                      subject.active
                        ? 'status-active'
                        : 'status-inactive'
                    }
                  >
                    {subject.active
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </div>

                <p>
                  <strong>Subject Code:</strong>{' '}
                  {subject.code}
                </p>

                <p>
                  <strong>Branch:</strong>{' '}
                  {subject.branch}
                </p>

                <p>
                  <strong>Semester:</strong>{' '}
                  {subject.semester}
                </p>
              </div>
            ))}
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

export default Subjects;