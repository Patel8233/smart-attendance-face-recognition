import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token =
          sessionStorage.getItem('accessToken');

        const response = await fetch(
          `http://localhost:3000/api/students/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || 'Failed to load student',
          );
          return;
        }

        setStudent(data);
      } catch (error) {
        console.error(error);
        setError('Unable to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token =
        sessionStorage.getItem('accessToken');

      const response = await fetch(
        `http://localhost:3000/api/students/${id}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: student.name,
            enrollmentNumber: student.enrollmentNumber,
            branch: student.branch,
            semester: Number(student.semester),
            section: student.section,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message ||
                'Failed to update student',
        );

        return;
      }

      alert('Student updated successfully');
      navigate('/students');
    } catch (error) {
      console.error(error);
      alert('Unable to connect to backend');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading student...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p>{error}</p>

        <button
          onClick={() => navigate('/students')}
        >
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Edit Student</h1>

        <p className="form-subtitle">
          Update the student information below.
        </p>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Enrollment Number</label>

            <input
              type="text"
              name="enrollmentNumber"
              value={student.enrollmentNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Branch</label>

            <input
              type="text"
              name="branch"
              value={student.branch}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Semester</label>

            <input
              type="number"
              name="semester"
              min="1"
              max="8"
              value={student.semester}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Section</label>

            <input
              type="text"
              name="section"
              value={student.section}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit">
              Save Changes
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate('/students')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;