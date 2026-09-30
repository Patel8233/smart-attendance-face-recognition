import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token =
          sessionStorage.getItem('accessToken');

        const response = await fetch(
          'http://localhost:3000/api/students',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || 'Failed to load students',
          );
          return;
        }

        setStudents(data);
      } catch {
        setError('Unable to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this student?',
    );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        sessionStorage.getItem('accessToken');

      const response = await fetch(
        `http://localhost:3000/api/students/${studentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || 'Failed to delete student',
        );
        return;
      }

      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) => student._id !== studentId,
        ),
      );

      alert('Student deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Unable to connect to backend');
    }
  };

  return (
    <div className="page-container">
      <div className="students-header">
        <h1>Student Management</h1>

        <button
          onClick={() => navigate('/students/add')}
        >
          + Add Student
        </button>
      </div>

      {loading && <p>Loading students...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div>
          <h2>Students List</h2>

          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div className="students-list">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="student-card"
                >
                  <h3>{student.name}</h3>

                  <p>
                    Enrollment:{' '}
                    {student.enrollmentNumber}
                  </p>

                  <p>
                    Branch: {student.branch}
                  </p>

                  <p>
                    Semester: {student.semester}
                  </p>

                  <p>
                    Section: {student.section}
                  </p>

                  <p>
                    Face Registered:{' '}
                    <span className="face-status">
                      {student.faceRegistered
                        ? 'Yes'
                        : 'No'}
                    </span>
                  </p>

                  <div className="student-actions">
                    <button
                      onClick={() =>
                        navigate(
                          `/students/${student.enrollmentNumber}/register-face`,
                        )
                      }
                    >
                      {student.faceRegistered
                        ? 'Update Face'
                        : 'Register Face'}
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/students/${student._id}/edit`,
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(student._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default Students;