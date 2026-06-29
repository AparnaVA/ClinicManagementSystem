import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/patients', label: 'Patients' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/appointments/add', label: 'Add Appointment' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/doctorAvailable', label: 'Availability' },
    { to: '/doctorLeave', label: 'Leave' },
    { to: '/calendar', label: 'Calendar' },
  ]

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top custom-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/dashboard">
          <span className="brand-badge">🏥</span>
          <span>Clinic Management</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <Link className="nav-link custom-nav-link" to={link.to} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-lg-2">
              <button
                className="btn btn-logout"
                onClick={() => {
                  closeMenu()
                  logout()
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .custom-navbar {
          background: linear-gradient(135deg, #1f3f35 0%, #2f5b4a 45%, #3f6f5d 100%);
          box-shadow: 0 8px 24px rgba(31, 63, 53, 0.18);
          padding: 12px 0;
        }

        .navbar-brand {
          color: white !important;
          font-size: 1.15rem;
          letter-spacing: 0.2px;
          text-decoration: none;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(255,255,255,0.16);
          font-size: 1.1rem;
        }

        .navbar-collapse {
          transition: all 0.3s ease;
        }

        .navbar-collapse.show {
          display: block;
        }

        .custom-nav-link {
          color: rgba(255,255,255,0.9) !important;
          font-weight: 500;
          padding: 8px 12px !important;
          border-radius: 999px;
          transition: all 0.2s ease;
        }

        .custom-nav-link:hover {
          background: rgba(255,255,255,0.12);
          color: white !important;
        }

        .navbar-nav {
          flex-direction: column;
        }

        @media (min-width: 992px) {
          .navbar-nav {
            flex-direction: row;
          }
        }

        .btn-logout {
          border-radius: 999px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.14);
          color: white;
          border: 1px solid rgba(255,255,255,0.22);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background: rgba(255,255,255,0.22);
          color: white;
          border-color: rgba(255,255,255,0.3);
        }

        .navbar-toggler {
          border: 1px solid rgba(255,255,255,0.3);
          padding: 6px 8px;
        }

        .navbar-toggler:focus {
          box-shadow: none;
          border-color: rgba(255,255,255,0.5);
        }

        .navbar-toggler-icon {
          filter: brightness(0) invert(1);
          width: 1.5em;
          height: 1.5em;
        }
      `}</style>
    </nav>
  )
}

export default Navbar