import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddSubject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    branch: '',
    semester: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token =
      sessionStorage.getItem('accessToken');

    const response = await fetch(
      'http://localhost:3000/api/subjects',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          ...formData,
          semester: Number(formData.semester),
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Failed to add subject',
      );

      return;
    }

    alert('Subject added successfully');

    navigate('/subjects');
  } catch (error) {
    console.error(error);

    alert('Unable to connect to backend');
  }
};

 return (
  <div className="page-container">
    <div className="form-container">
      <h1>Add Subject</h1>

      <p className="form-subtitle">
        Add a new subject for class sessions and attendance.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter subject name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Subject Code</label>

          <input
            type="text"
            name="code"
            placeholder="Example: CS-604"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Branch</label>

          <input
            type="text"
            name="branch"
            placeholder="Example: CSE Data Science"
            value={formData.branch}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Semester</label>

          <input
            type="number"
            name="semester"
            placeholder="Enter semester"
            min="1"
            max="8"
            value={formData.semester}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">
            Save Subject
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/subjects')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default AddSubject;