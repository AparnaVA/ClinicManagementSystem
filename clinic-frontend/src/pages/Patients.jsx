import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

function Patients() {
  const [patients, setPatients] = useState([])
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const patientsPerPage = 5

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
    if (!window.confirm('Delete Patient?')) {
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
      <div className="patients-page">
        <style>{`
          .patients-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f7fbf8 0%, #eef6f4 100%);
            padding: 24px 0 40px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .page-card {
            background: rgba(255,255,255,0.96);
            border: 0;
            border-radius: 24px;
            box-shadow: 0 14px 40px rgba(31, 63, 53, 0.08);
            padding: 24px;
          }

          .page-title {
            color: #1f3f35;
            font-weight: 700;
          }

          .search-box {
            border-radius: 999px;
            border: 4px solid #dce9e3;
            padding: 12px 16px;
            background: #f8fcfa;
          }

          .search-box:focus {
            box-shadow: 0 0 0 0.2rem rgba(63, 111, 93, 0.16);
            border-color: #8dc3b6;
          }

          .add-btn {
            border-radius: 999px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #3f6f5d, #5a8874);
            border: none;
            font-weight: 600;
          }

          .table-wrap {
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid #e8f1ec;
          }

          .patients-table thead {
            background: linear-gradient(135deg, #3f6f5d, #5a8874);
            color: white;
          }

          .patients-table th,
          .patients-table td {
            vertical-align: middle;
            padding: 14px 16px;
          }

          .patients-table tbody tr:nth-child(even) {
            background: #f8fcfa;
          }

          .action-btn-edit {
            border-radius: 999px;
            padding: 7px 12px;
            background: #f7d97a;
            color: #6c4c0b;
            border: none;
            font-weight: 600;
          }

          .action-btn-delete {
            border-radius: 999px;
            padding: 7px 12px;
            background: #f7dede;
            color: #9b1c1c;
            border: none;
            font-weight: 600;
          }

          .pagination-wrap {
            display: flex;
            justify-content: center;
            margin-top: 16px;
            gap: 8px;
          }

          .page-btn {
            border-radius: 999px;
            border: 1px solid #dce9e3;
            background: white;
            color: #2f5b4a;
            padding: 7px 12px;
            font-weight: 600;
          }

          .page-btn.active {
            background: linear-gradient(135deg, #3f6f5d, #5a8874);
            color: white;
            border: none;
          }
        `}</style>

        <div className="container">
          <div className="page-card">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div>
                <h2 className="page-title mb-1">Patients</h2>
                <p className="text-muted mb-0">Manage patient records and keep everything organized.</p>
              </div>

              <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
                <input
                  type="text"
                  className="form-control search-box"
                  placeholder="Search patient"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <Link to="/patients/add" className="btn btn-primary add-btn">
                  Add Patient
                </Link>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table table-hover mb-0 patients-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.patient_id}</td>
                      <td>{patient.name}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.email}</td>
                      <td>
                        <Link to={`/patients/edit/${patient.id}`} className="btn btn-sm action-btn-edit me-2">
                          Edit
                        </Link>
                        <button className="btn btn-sm action-btn-delete" onClick={() => deletePatient(patient.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
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