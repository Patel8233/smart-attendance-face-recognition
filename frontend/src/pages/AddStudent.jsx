import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddStudent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollmentNumber: '',
    branch: '',
    semester: '',
    section: '',
    phone: '',
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
      'http://localhost:3000/api/students',
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
          : data.message || 'Failed to add student',
      );

      return;
    }

    alert('Student added successfully');

    navigate('/students');
  } catch (error) {
    console.error(error);

    alert('Unable to connect to backend');
  }
};

 return (
  <div className="page-container">
    <div className="form-container">
      <h1>Add Student</h1>

      <p className="form-subtitle">
        Enter student details to create a new student.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter student name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Enrollment Number</label>
          <input
            type="text"
            name="enrollmentNumber"
            placeholder="Enter enrollment number"
            value={formData.enrollmentNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Branch</label>
          <input
            type="text"
            name="branch"
            placeholder="Enter branch"
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

        <div className="form-group">
          <label>Section</label>
          <input
            type="text"
            name="section"
            placeholder="Enter section"
            value={formData.section}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">
            Save Student
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

export default AddStudent;