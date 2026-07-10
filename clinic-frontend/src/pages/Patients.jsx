import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

function Patients() {
  const [patients, setPatients] = useState([])
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const patientsPerPage = 5

  // 1. Retrieve the logged-in user role from localStorage
  const userRole = localStorage.getItem('role') || 'reception'

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('patients/list/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setPatients(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deletePatient = async (id) => {
    // 2. Extra safety safeguard check in case button is somehow exposed
    if (userRole === 'admin') {
      alert('Access Denied: Admins hold read-only clearance.')
      return
    }

    if (!window.confirm('Delete Patient Record?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await api.delete(`patients/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchPatients()
    } catch (error) {
      console.log(error)
    }
  }

  const searchPatients = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get(`patients/search/?search=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setPatients(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (keyword.trim() === '') {
      fetchPatients()
      return
    }
    searchPatients()
  }, [keyword])

  const totalPages = Math.ceil(patients.length / patientsPerPage)
  const startIndex = (currentPage - 1) * patientsPerPage
  const currentPatients = patients.slice(startIndex, startIndex + patientsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [keyword])

  return (
    <>
      <Navbar />
      <div className="patients-page page-fade-in">
        <style>{`
          .patients-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f4f7f5 0%, #edf3f0 100%);
            padding: 32px 0 60px;
            font-family: 'Inter', system-ui, sans-serif;
            color: #334155;
          }

          .page-fade-in {
            animation: slideUpFade 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .page-card {
            background: #ffffff;
            border: 1px solid rgba(47, 91, 74, 0.08);
            border-radius: 16px;
            box-shadow: 0 6px 20px rgba(31, 63, 53, 0.03);
            padding: 28px;
          }

          .page-title {
            color: #1f3f35;
            font-weight: 700;
            letter-spacing: -0.02em;
          }

          .search-box {
            padding: 10px 16px;
            font-size: 0.9rem;
            color: #334155;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            transition: all 0.15s ease-in-out;
            min-width: 260px;
          }

          .search-box:focus {
            background-color: #ffffff;
            border-color: #2f5b4a;
            outline: 0;
            box-shadow: 0 0 0 3px rgba(47, 91, 74, 0.12);
          }

          .add-btn {
            background: #2f5b4a !important;
            color: white !important;
            font-weight: 600;
            font-size: 0.9rem;
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(47, 91, 74, 0.15);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
          }

          .add-btn:hover {
            background: #1f3f35 !important;
            transform: translateY(-1px);
          }

          .table-wrap {
            overflow: hidden;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
          }

          .patients-table {
            margin-bottom: 0;
            font-size: 0.9rem;
            vertical-align: middle;
          }

          .patients-table thead {
            background-color: #f8fafc;
          }

          .patients-table th {
            font-weight: 600;
            color: #475569;
            padding: 14px 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 0.825rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }

          .patients-table td {
            padding: 16px;
            color: #000000;
            border-bottom: 1px solid #f1f5f9;
          }

          .patients-table tbody tr:last-child td {
            border-bottom: none;
          }

          .patient-id-cell {
            font-variant-numeric: tabular-nums;
            font-weight: 500;
            color: #64748b;
          }

          .patient-name-cell {
            font-weight: 600;
            color: #1e293b;
          }

          .action-btn-edit {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
            padding: 6px 14px;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 8px;
            transition: all 0.15s ease;
            text-decoration: none;
            display: inline-block;
          }

          .action-btn-edit:hover {
            background: #f59e0b;
            color: white;
            border-color: #f59e0b;
          }

          .action-btn-delete {
            background: #fff5f5;
            color: #e53e3e;
            border: 1px solid #fed7d7;
            padding: 6px 14px;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 8px;
            transition: all 0.15s ease;
          }

          .action-btn-delete:hover {
            background: #e53e3e;
            color: white;
            border-color: #e53e3e;
          }

          /* --- Read Only Indicator pill for Admin view --- */
          .readonly-badge {
            display: inline-block;
            background: #f1f5f9;
            color: #64748b;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }

          .empty-state {
            padding: 48px;
            text-align: center;
            color: #94a3b8;
            font-size: 0.95rem;
          }

          .pagination-wrap {
            display: flex;
            justify-content: center;
            margin-top: 24px;
            gap: 4px;
          }

          .page-btn {
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            background: white;
            color: #4a5568;
            padding: 6px 14px;
            font-weight: 500;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .page-btn:hover:not(:disabled) {
            border-color: #2f5b4a;
            color: #2f5b4a;
            background: #f8faf9;
          }

          .page-btn.active {
            background: #2f5b4a;
            color: white;
            border-color: #2f5b4a;
          }

          .page-btn:disabled {
            background: #f1f5f9;
            color: #94a3b8;
            border-color: #e2e8f0;
            cursor: not-allowed;
          }
        `}</style>

        <div className="container">
          <div className="page-card">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div>
                <h3 className="page-title mb-1">Patients Registry</h3>
                <p className="text-muted small mb-0">
                  {userRole === 'ADMIN' 
                    ? 'Read-only profile directory access for clinic operations auditing.' 
                    : 'Audit clinical health accounts, adjust diagnostic profiling parameters, and maintain directories.'}
                </p>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto align-items-sm-center">
                <input
                  type="text"
                  className="search-box"
                  placeholder="🔍 Search patient data registry..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                
                {/* 3. Conditional rendering: Hide "Add Patient" if user is an admin */}
                {userRole !== 'ADMIN' && (
                  <Link to="/patients/add" className="add-btn">
                    Add Patient
                  </Link>
                )}
              </div>
            </div>

            <div className="table-wrap">
              <table className="table table-hover mb-0 patients-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Full Name</th>
                    <th>Contact Phone</th>
                    <th>Email Address</th>
                    <th className="text-end">
                      {userRole === 'ADMIN' ? 'Clearance Access' : 'Management Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        📋 No patient accounts matching your current search parameters were located.
                      </td>
                    </tr>
                  ) : (
                    currentPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="patient-id-cell">{patient.patient_id}</td>
                        <td className="patient-name-cell">{patient.name}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.email}</td>
                        <td className="text-end">
                          {/* 4. Conditional rendering: Hide mutation buttons if admin */}
                          {userRole === 'ADMIN' ? (
                            <span className="readonly-badge">View Only</span>
                          ) : (
                            <>
                              <Link to={`/patients/edit/${patient.id}`} className="action-btn-edit me-2">
                                Edit
                              </Link>
                              <button className="action-btn-delete" onClick={() => deletePatient(patient.id)}>
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination-wrap">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Patients