import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post('accounts/login/', {
        username,
        password,
      })

      localStorage.setItem('token', response.data.access)
      setMessage({ type: 'success', text: 'Welcome back! Redirecting to your dashboard...' })
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch {
      setMessage({ type: 'error', text: 'Invalid username or password. Please try again.' })
    }
  }

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            
            url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80') center/cover no-repeat;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 1120px;
          border: 0;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.55);
        }

        .login-left {
          background: linear-gradient(135deg, #3f6f5d 0%, #2f5b4a 45%, #1c3f35 100%);
          color: white;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          min-height: 520px;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255,255,255,0.16), transparent 42%),
            radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 35%);
          pointer-events: none;
        }

        .login-left .icon-badge {
          width: 68px;
          height: 68px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.16);
          font-size: 32px;
          margin-bottom: 24px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.24);
          position: relative;
          z-index: 1;
        }

        .login-right {
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,252,255,0.96));
        }

        .form-control {
          border-radius: 14px;
          padding: 13px 15px;
          border: 1px solid #dce9e3;
          background: rgba(250, 253, 252, 0.95);
          transition: all 0.2s ease;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(63, 111, 93, 0.16);
          border-color: #8dc3b6;
        }

        .login-btn {
          border-radius: 999px;
          padding: 12px 20px;
          font-weight: 600;
          background: linear-gradient(135deg, #3f6f5d, #5a8874);
          border: none;
          transition: all 0.2s ease;
          letter-spacing: 0.2px;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(63, 111, 93, 0.2);
        }

        .feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
          position: relative;
          z-index: 1;
        }

        .feature-pill {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.16);
          font-size: 0.9rem;
          border: 1px solid rgba(255,255,255,0.18);
        }

        .status-message {
          padding: 12px 14px;
          border-radius: 12px;
          margin-bottom: 16px;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .status-success {
          background: #e9f7f0;
          color: #176648;
          border: 1px solid #b9e7cf;
        }

        .status-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        @media (max-width: 767px) {
          .login-left {
            padding: 28px;
          }

          .login-right {
            padding: 28px;
          }
        }
      `}</style>

      <div className="card login-card">
        <div className="row g-0">
          <div className="col-lg-6 login-left">
            <div className="icon-badge">🏥</div>
            <h2 className="fw-bold mb-3">Clinic Management</h2>
            <p className="mb-0 fs-5 opacity-90" style={{ maxWidth: '440px', lineHeight: 1.6 }}>
              Deliver better care with a modern platform for appointments, patients, doctors, and daily operations.
            </p>
            <div className="feature-list">
              <span className="feature-pill">Appointment Scheduling</span>
              <span className="feature-pill">Patient Records</span>
              <span className="feature-pill">Secure Access</span>
            </div>
          </div>

          <div className="col-lg-6 login-right">
            <h3 className="fw-bold mb-2">Welcome back</h3>
            <p className="text-muted mb-4">Sign in to continue to your dashboard</p>

            <form onSubmit={handleSubmit}>
              {message.text && (
                <div className={`status-message ${message.type === 'success' ? 'status-success' : 'status-error'}`}>
                  {message.text}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary w-100 login-btn">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login