import { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Login failed');
        return;
      }

      sessionStorage.setItem(
        'accessToken',
        data.accessToken,
      );

      sessionStorage.setItem(
        'user',
        JSON.stringify(data.user),
      );

      setMessage('Login successful');

      onLogin(data.user);
    } catch {
      setMessage('Unable to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-page">
    <div className="login-card">
      <div className="login-header">
        <div className="login-logo">
          SA
        </div>

        <h1>Smart Attendance System</h1>

        <p>
          Face Recognition Based Attendance Management
        </p>
      </div>

      <div className="login-title">
        <h2>Admin / Teacher Login</h2>
        <p>Sign in to continue to your dashboard.</p>
      </div>

      <form
        className="login-form"
        onSubmit={handleLogin}
      >
        <div className="form-group">
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && (
        <div
          className={
            message === 'Login successful'
              ? 'login-message success-message'
              : 'login-message error-message'
          }
        >
          {message}
        </div>
      )}

      <p className="login-footer">
        Secure attendance management for authorized
        administrators and teachers.
      </p>
    </div>
  </div>
);
}

export default Login;