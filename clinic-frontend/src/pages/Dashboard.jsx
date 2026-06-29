import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import api from '../api/axios'

function Dashboard() {
  const [data, setData] = useState(null)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await api.get('dashboard/summary/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setData(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchDashboard()
  }, [])

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="card shadow-sm border-0 p-4 text-center">
            <h4 className="mb-2">Loading dashboard...</h4>
            <p className="text-muted mb-0">Preparing your clinic overview.</p>
          </div>
        </div>
      </>
    )
  }

  const stats = [
    {
      title: 'Total Patients',
      value: data.total_patients ?? 0,
      icon: '🧑‍⚕️',
      accent: 'linear-gradient(135deg, #3f6f5d, #5a8874)',
    },
    {
      title: 'Doctors',
      value: data.total_doctors ?? 0,
      icon: '🩺',
      accent: 'linear-gradient(135deg, #2f6f67, #4b8f86)',
    },
    {
      title: 'Appointments',
      value: data.total_appointments ?? 0,
      icon: '📅',
      accent: 'linear-gradient(135deg, #426a9b, #5c89c4)',
    },
    {
      title: 'Today',
      value: data.today_appointments ?? 0,
      icon: '✨',
      accent: 'linear-gradient(135deg, #7d5a3d, #a77d4f)',
    },
  ]

  const panelContent = {
    overview: {
      title: 'Daily performance',
      text: 'Your clinic is on track with a healthy workflow and steady patient activity.',
      highlight: 'Proactive care is improving appointment flow and response time.',
    },
    patients: {
      title: 'Patient focus',
      text: 'New visits and follow-ups are being managed smoothly across the clinic.',
      highlight: 'Patient records remain organized and ready for quick access.',
    },
    appointments: {
      title: 'Upcoming care',
      text: 'Appointments are flowing well, and the schedule stays balanced throughout the day.',
      highlight: 'Staff can keep attention on urgent cases without losing visibility.',
    },
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <style>{`
          .dashboard-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f7fbf9 0%, #eef6f7 100%);
            padding: 24px 0 40px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .dashboard-hero {
            background: linear-gradient(135deg, #3f6f5d 0%, #2f5b4a 45%, #1f3f35 100%);
            color: white;
            border: 0;
            border-radius: 24px;
            padding: 30px;
            box-shadow: 0 18px 45px rgba(31, 63, 53, 0.18);
            margin-bottom: 24px;
          }

          .dashboard-hero .badge {
            display: inline-block;
            background: rgba(255,255,255,0.16);
            border: 1px solid rgba(255,255,255,0.2);
            padding: 7px 12px;
            border-radius: 999px;
            font-size: 0.85rem;
            margin-bottom: 12px;
          }

          .dashboard-hero .hero-actions button {
            border: 0;
            border-radius: 999px;
            padding: 10px 16px;
            font-weight: 600;
            margin-right: 10px;
            margin-top: 10px;
            transition: transform 0.2s ease;
          }

          .dashboard-hero .hero-actions button:hover {
            transform: translateY(-2px);
          }

          .hero-btn-light {
            background: white;
            color: #2f5b4a;
          }

          .hero-btn-outline {
            background: rgba(255,255,255,0.12);
            color: white;
            border: 1px solid rgba(255,255,255,0.22) !important;
          }

          .mini-panel {
            background: rgba(255,255,255,0.14);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 18px;
            padding: 18px;
            backdrop-filter: blur(6px);
          }

          .mini-number {
            font-size: 2rem;
            font-weight: 700;
          }

          .stat-card {
            border: 0;
            border-radius: 20px;
            padding: 18px;
            min-height: 146px;
            color: white;
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
          }

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.35rem;
            background: rgba(255,255,255,0.2);
            margin-bottom: 14px;
          }

          .content-card {
            border: 0;
            border-radius: 20px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
            padding: 20px;
            background: white;
          }

          .view-switch button {
            border: 0;
            background: #f2f7f4;
            color: #2f5b4a;
            border-radius: 999px;
            padding: 7px 12px;
            margin-left: 8px;
            font-size: 0.9rem;
          }

          .view-switch .active {
            background: #3f6f5d;
            color: white;
          }

          .highlight-box {
            background: linear-gradient(135deg, #f4faf7, #edf6f2);
            border-radius: 16px;
            padding: 14px 16px;
            color: #2f5b4a;
            font-weight: 600;
            margin-top: 14px;
          }

          .quick-action {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eef4f2;
          }

          .quick-action:last-child {
            border-bottom: 0;
          }

          @media (max-width: 767px) {
            .dashboard-hero {
              padding: 22px;
            }
          }
        `}</style>

        <div className="container">
          <div className="dashboard-hero">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="badge">Care Center Dashboard</div>
                <h2 className="fw-bold mb-2">Welcome back — your clinic is running smoothly.</h2>
                <p className="mb-3" style={{ maxWidth: '620px', lineHeight: 1.6 }}>
                  Track patients, appointments, and daily operations from one beautiful workspace.
                </p>
                <div className="hero-actions">
                  <button className="hero-btn-light" type="button" onClick={() => setActiveView('appointments')}>
                    View appointments
                  </button>
                  <button className="hero-btn-outline" type="button" onClick={() => setActiveView('patients')}>
                    Review patients
                  </button>
                </div>
              </div>

              <div className="col-lg-4 mt-3 mt-lg-0">
                <div className="mini-panel">
                  <div className="small text-uppercase fw-semibold opacity-75">Today’s outlook</div>
                  <div className="mini-number">{data.today_appointments ?? 0}</div>
                  <div className="small opacity-75">appointments scheduled</div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {stats.map((item) => (
              <div className="col-md-6 col-xl-3" key={item.title}>
                <div className="stat-card" style={{ background: item.accent }}>
                  <div className="stat-icon">{item.icon}</div>
                  <h6 className="mb-1 opacity-75">{item.title}</h6>
                  <h2 className="fw-bold mb-0">{item.value}</h2>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mt-1">
            <div className="col-lg-8">
              <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Clinic overview</h5>
                  <div className="view-switch">
                    <button className={activeView === 'overview' ? 'active' : ''} type="button" onClick={() => setActiveView('overview')}>
                      Overview
                    </button>
                    <button className={activeView === 'patients' ? 'active' : ''} type="button" onClick={() => setActiveView('patients')}>
                      Patients
                    </button>
                    <button className={activeView === 'appointments' ? 'active' : ''} type="button" onClick={() => setActiveView('appointments')}>
                      Appointments
                    </button>
                  </div>
                </div>

                <h6 className="fw-semibold">{panelContent[activeView].title}</h6>
                <p className="text-muted mb-0">{panelContent[activeView].text}</p>
                <div className="highlight-box">{panelContent[activeView].highlight}</div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="content-card">
                <h5 className="fw-bold mb-3">Quick actions</h5>
                <div className="quick-action">
                  <span>📋 Add appointment</span>
                  <span className="text-muted">Fast</span>
                </div>
                <div className="quick-action">
                  <span>🧾 Create patient record</span>
                  <span className="text-muted">New</span>
                </div>
                <div className="quick-action">
                  <span>📈 Review analytics</span>
                  <span className="text-muted">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard