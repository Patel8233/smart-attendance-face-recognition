import { useState } from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

function RegisterFace() {
  const navigate = useNavigate();
  const { enrollmentNumber } = useParams();

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!image) {
    alert('Please select a face image');
    return;
  }

  try {
    const token =
      sessionStorage.getItem('accessToken');

    const formData = new FormData();

    formData.append('file', image);

    const response = await fetch(
      `http://localhost:3000/api/students/${enrollmentNumber}/register-face`,
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
          : data.message || 'Face registration failed',
      );

      return;
    }

    alert('Face registered successfully');

    navigate('/students');
  } catch (error) {
    console.error(error);

    alert('Unable to connect to backend');
  }
};

  return (
  <div className="page-container">
    <div className="form-container">
      <h1>Face Registration</h1>

      <p className="form-subtitle">
        Upload a clear face image for attendance recognition.
      </p>

      <div className="form-group">
        <label>Enrollment Number</label>

        <input
          type="text"
          value={enrollmentNumber}
          readOnly
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Face Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {image && (
          <p>
            Selected Image: <strong>{image.name}</strong>
          </p>
        )}

        <div className="form-actions">
          <button type="submit">
            Register Face
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

      <p
        style={{
          marginTop: '20px',
          fontSize: '13px',
          color: '#64748b',
        }}
      >
        Use a clear image of the consenting student with
        their face clearly visible.
      </p>
    </div>
  </div>
);
}

export default RegisterFace;