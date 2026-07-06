import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Dashboard() {
  const [data, setData] = useState(null)
  const [activeView, setActiveView] = useState('overview')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await api.get('dashboard/summary/', {
          headers: { Authorization: `Bearer ${token}` },
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
        <div className="page-wrapper-loading d-flex align-items-center justify-content-center">
          <div className="clinic-card text-center p-5" style={{ maxWidth: '400px' }}>
            <div className="spinner-border mb-3" style={{ color: '#2f5b4a' }} role="status"></div>
            <h5 className="fw-bold mb-1" style={{ color: '#1f3f35' }}>Loading dashboard...</h5>
            <p className="text-muted small mb-0">Preparing your clinic overview.</p>
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
      borderColor: '#2f5b4a',
      bgAlpha: 'rgba(47, 91, 74, 0.04)',
    },
    {
      title: 'Doctors On Staff',
      value: data.total_doctors ?? 0,
      icon: '🩺',
      borderColor: '#4b8f86',
      bgAlpha: 'rgba(75, 143, 134, 0.04)',
    },
    {
      title: 'Appointments',
      value: data.total_appointments ?? 0,
      icon: '📅',
      borderColor: '#426a9b',
      bgAlpha: 'rgba(66, 106, 155, 0.04)',
    },
    {
      title: 'Today’s Tasks',
      value: data.today_appointments ?? 0,
      icon: '✨',
      borderColor: '#a77d4f',
      bgAlpha: 'rgba(167, 125, 79, 0.04)',
    },
  ]

  const panelContent = {
    overview: {
      title: 'Daily Performance Tracker',
      text: 'Your clinic is operating efficiently. Patient intake volumes, scheduling blocks, and specialist availability are currently synchronized with target workflows.',
      highlight: '⚡ Proactive care structures have improved overall appointment transit flow by 14% this week.',
    },
    patients: {
      title: 'Patient Cohort Insights',
      text: 'New profiles and recurring consultations are distributed evenly across departments. Electronic health records remain securely cached and ready for authorized lookup.',
      highlight: '📂 All recently closed consultation records have been filed into the primary management database system.',
    },
    appointments: {
      title: 'Upcoming Care Pipelines',
      text: 'The schedule matrices maintain balanced hourly loads, preventing check-in congestion. Staff distribution remains properly tuned to expected load peaks.',
      highlight: '🕒 Peak operation tracking shows high room utilization between 10:00 AM and 2:00 PM.',
    },
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <style>{`
          .dashboard-page, .page-wrapper-loading {
            min-height: 100vh;
            background: linear-gradient(135deg, #f4f7f5 0%, #edf3f0 100%);
            padding: 32px 0 50px;
            font-family: 'Inter', system-ui, sans-serif;
            color: #334155;
          }

          .page-wrapper-loading {
            padding: 0;
          }

          /* --- Elegant Modern Hero Banner --- */
          .dashboard-hero {
            background: linear-gradient(135deg, #1f3f35 0%, #2f5b4a 100%);
            color: white;
            border: none;
            border-radius: 20px;
            padding: 36px;
            box-shadow: 0 12px 35px rgba(31, 63, 53, 0.12);
            margin-bottom: 32px;
          }

          .dashboard-hero .hero-tag {
            display: inline-block;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.18);
            padding: 5px 14px;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
          }

          .dashboard-hero h2 {
            font-size: 1.85rem;
            letter-spacing: -0.02em;
          }

          .hero-actions button {
            border: 0;
            border-radius: 10px;
            padding: 10px 20px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-right: 12px;
            margin-top: 12px;
            transition: all 0.2s ease;
          }

          .hero-btn-light {
            background: #ffffff;
            color: #1f3f35;
          }

          .hero-btn-light:hover {
            background: #f1f5f9;
            transform: translateY(-1px);
          }

          .hero-btn-outline {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.25) !important;
          }

          .hero-btn-outline:hover {
            background: rgba(255, 255, 255, 0.18);
            transform: translateY(-1px);
          }

          .mini-panel {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(8px);
          }

          .mini-number {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.1;
            margin: 4px 0;
            font-variant-numeric: tabular-nums;
          }

          /* --- Clean Structured Cards --- */
          .clinic-card {
            background: #ffffff;
            border: 1px solid rgba(47, 91, 74, 0.08);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(31, 63, 53, 0.03);
          }

          /* Stat Display Grid Card Mod */
          .stat-card {
            background: #ffffff;
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-left: 5px solid var(--accent-color);
            border-radius: 14px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(31, 63, 53, 0.06);
          }

          .stat-icon-frame {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            margin-bottom: 16px;
          }

          .stat-card h2 {
            font-size: 1.85rem;
            font-weight: 700;
            color: #1e293b;
            font-variant-numeric: tabular-nums;
          }

          /* --- Dynamic View Control Segment --- */
          .view-switch-container {
            background: #f1f5f9;
            padding: 4px;
            border-radius: 10px;
            display: inline-flex;
            gap: 2px;
          }

          .view-switch-container button {
            border: 0;
            background: transparent;
            color: #64748b;
            border-radius: 8px;
            padding: 6px 16px;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.15s ease;
          }

          .view-switch-container button.active {
            background: #ffffff;
            color: #1f3f35;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          }

          .highlight-box {
            background: #f0f7f4;
            border-left: 4px solid #2f5b4a;
            border-radius: 8px;
            padding: 14px 16px;
            color: #1f3f35;
            font-weight: 500;
            font-size: 0.9rem;
            margin-top: 18px;
          }

          /* --- Micro Action List Interface --- */
          .quick-action-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .quick-action-row:last-child {
            margin-bottom: 0;
          }

          .quick-action-row:hover {
            background: #ffffff;
            border-color: #2f5b4a;
            box-shadow: 0 4px 12px rgba(47, 91, 74, 0.06);
            transform: translateX(2px);
          }

          .action-tag {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 6px;
            background: #e2e8f0;
            color: #475569;
          }
          
          .quick-action-row:hover .action-tag {
            background: rgba(47, 91, 74, 0.1);
            color: #2f5b4a;
          }
        `}</style>

        <div className="container">
          {/* Main Workspace Intro Section */}
          <div className="dashboard-hero">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="hero-tag">Clinical Workspace</div>
                <h2 className="fw-bold mb-2">Welcome back — your operations are synchronized.</h2>
                <p className="mb-3 opacity-90" style={{ maxWidth: '640px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Track patient registrations, monitor active provider schedules, and audit diagnostic appointments in real time.
                </p>
                <div className="hero-actions">
                  <button className="hero-btn-light" type="button" onClick={() => navigate('/appointments')}>
                    Schedules Matrix
                  </button>
                  <button className="hero-btn-outline" type="button" onClick={() => navigate('/patients')}>
                    Patient Archives
                  </button>
                </div>
              </div>

              <div className="col-lg-4 mt-4 mt-lg-0">
                <div className="mini-panel">
                  <div className="small text-uppercase fw-semibold opacity-75" style={{ letterSpacing: '0.05em' }}>Today’s Load Metrics</div>
                  <div className="mini-number">{data.today_appointments ?? 0}</div>
                  <div className="small opacity-75">active check-ins running</div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Metrics Track System */}
          <div className="row g-3 mb-4">
            {stats.map((item) => (
              <div className="col-md-6 col-xl-3" key={item.title}>
                <div className="stat-card" style={{ '--accent-color': item.borderColor }}>
                  <div className="stat-icon-frame" style={{ background: item.bgAlpha }}>
                    {item.icon}
                  </div>
                  <div className="text-muted small fw-medium mb-1">{item.title}</div>
                  <h2 className="mb-0">{item.value}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Workspace Controls and Activity Panels */}
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="clinic-card h-100">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                  <h5 className="fw-bold mb-0" style={{ color: '#1f3f35', letterSpacing: '-0.01em' }}>Operational Summary</h5>
                  <div className="view-switch-container">
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

                <h6 className="fw-bold mb-2" style={{ color: '#334155' }}>{panelContent[activeView].title}</h6>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{panelContent[activeView].text}</p>
                <div className="highlight-box">{panelContent[activeView].highlight}</div>
              </div>
            </div>

            {/* Practical Action Matrix */}
            <div className="col-lg-4">
              <div className="clinic-card h-100">
                <h5 className="fw-bold mb-3" style={{ color: '#1f3f35', letterSpacing: '-0.01em' }}>Core Procedures</h5>
                
                <div className="quick-action-row" onClick={() => navigate('/appointments/add')}>
                  <span className="fw-medium small">📋 Create Appointment</span>
                  <span className="action-tag">Booking</span>
                </div>
                
                <div className="quick-action-row" onClick={() => navigate('/patients/add')}>
                  <span className="fw-medium small">🧾 Record New Patient</span>
                  <span className="action-tag">Intake</span>
                </div>
                
                <div className="quick-action-row" onClick={() => navigate('/doctorAvailable')}>
                  <span className="fw-medium small">📈 Adjust Shift Schedules</span>
                  <span className="action-tag">Roster</span>
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