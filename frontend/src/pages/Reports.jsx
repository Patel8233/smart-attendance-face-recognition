import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Reports() {
  const navigate = useNavigate();

  const [enrollmentNumber, setEnrollmentNumber] =
    useState('');

  const [subjectCode, setSubjectCode] =
    useState('');

  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetReport = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setReport(null);

    try {
      const token =
        sessionStorage.getItem('accessToken');

      const enrollment =
        encodeURIComponent(enrollmentNumber.trim());

      const subject =
        encodeURIComponent(subjectCode.trim());

      const response = await fetch(
        `http://localhost:3000/api/attendance/report/${enrollment}/${subject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Failed to load report',
        );

        return;
      }

      setReport(data);
    } catch (error) {
      console.error(error);
      setError('Unable to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="page-container">
    <div className="reports-header">
      <h1>Attendance Reports</h1>

      <p className="form-subtitle">
        Check a student's attendance report for a specific subject.
      </p>
    </div>

    <div className="report-search-box">
      <h2>Generate Report</h2>

      <form onSubmit={handleGetReport}>
        <div className="form-group">
          <label>Enrollment Number</label>

          <input
            type="text"
            placeholder="Enter enrollment number"
            value={enrollmentNumber}
            onChange={(e) =>
              setEnrollmentNumber(e.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Subject Code</label>

          <input
            type="text"
            placeholder="Example: CS-601"
            value={subjectCode}
            onChange={(e) =>
              setSubjectCode(e.target.value)
            }
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading Report...' : 'Get Report'}
        </button>
      </form>
    </div>

    {error && (
      <p className="error-message">
        {error}
      </p>
    )}

    {report && (
      <div className="report-result">
        <div className="report-student-info">
          <h2>{report.studentName}</h2>

          <p>
            <strong>Enrollment:</strong>{' '}
            {report.enrollmentNumber}
          </p>

          <p>
            <strong>Subject:</strong>{' '}
            {report.subjectName} - {report.subjectCode}
          </p>
        </div>

        <div className="report-cards">
          <div className="report-card">
            <p>Total Classes</p>
            <h2>{report.totalClasses}</h2>
          </div>

          <div className="report-card">
            <p>Present</p>
            <h2>{report.presentClasses}</h2>
          </div>

          <div className="report-card">
            <p>Absent</p>
            <h2>{report.absentClasses}</h2>
          </div>

          <div className="report-card percentage-card">
            <p>Attendance</p>
            <h2>
              {report.attendancePercentage}%
            </h2>
          </div>
        </div>

        <div className="attendance-progress">
          <div className="progress-header">
            <span>Attendance Percentage</span>

            <strong>
              {report.attendancePercentage}%
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(
                  Number(report.attendancePercentage) || 0,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
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

export default Reports;