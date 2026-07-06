import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function DoctorLeave() {
  const [doctors, setDoctors] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    doctor: '',
    working_day: '', 
    leave_date: '',
    reason: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const leavesPerPage = 5;

  const LoadLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('doctors/leave/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeaves(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('doctors/list/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDoctors();
    LoadLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const saveLeave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('doctors/leave/create/', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      LoadLeaves();
      setFormData({
        doctor: '',
        working_day: '',
        leave_date: '',
        reason: ''
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLeave = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`doctors/leave/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      LoadLeaves();
    } catch (error) {
      console.log(error);
    }
  };

 
    const totalPages = Math.ceil(leaves.length / leavesPerPage);
    const startIndex = (currentPage - 1) * leavesPerPage;
    const currentLeaves = leaves.slice(startIndex, startIndex + leavesPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [leaves.length]);

  return (
    <>
      <Navbar />
      <div className="leave-management-page">
        <style>{`
          .leave-management-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f4f7f5 0%, #edf3f0 100%);
            padding: 32px 0 60px;
            font-family: 'Inter', system-ui, sans-serif;
            color: #334155;
          }

          /* --- Smooth Component Entrance Animation --- */
          .page-fade-in {
            animation: slideUpFade 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes slideUpFade {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* --- Modern Component Architecture --- */
          .clinic-card {
            background: #ffffff;
            border: 1px solid rgba(47, 91, 74, 0.08);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(31, 63, 53, 0.03);
          }

          .section-title {
            color: #1f3f35;
            font-weight: 700;
            letter-spacing: -0.01em;
            margin-bottom: 4px;
          }

          /* --- Clean Form Styles --- */
          .form-label {
            font-size: 0.825rem;
            font-weight: 600;
            color: #475569;
            margin-bottom: 6px;
          }

          .clinic-input, .clinic-select {
            display: block;
            width: 100%;
            padding: 10px 14px;
            font-size: 0.9rem;
            font-weight: 400;
            line-height: 1.5;
            color: #334155;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            transition: all 0.15s ease-in-out;
            margin-bottom: 18px;
          }

          .clinic-input:focus, .clinic-select:focus {
            background-color: #ffffff;
            border-color: #2f5b4a;
            outline: 0;
            box-shadow: 0 0 0 3px rgba(47, 91, 74, 0.12);
          }

          .btn-save {
            background: #2f5b4a;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            padding: 11px;
            border: none;
            border-radius: 10px;
            width: 100%;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(47, 91, 74, 0.15);
          }

          .btn-save:hover {
            background: #1f3f35;
            transform: translateY(-1px);
          }

          /* --- Clean Structured Table Overrides --- */
          .custom-table-container {
            overflow-hidden;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }

          .clinic-table {
            margin-bottom: 0;
            font-size: 0.9rem;
            vertical-align: middle;
          }

          .clinic-table thead {
            background-color: #f8fafc;
          }

          .clinic-table th {
            font-weight: 600;
            color: #475569;
            padding: 14px 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 0.825rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }

          .clinic-table td {
            padding: 16px;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
          }

          .clinic-table tr:last-child td {
            border-bottom: none;
          }

          .badge-reason {
            background-color: #f1f5f9;
            color: #475569;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 0.85rem;
            display: inline-block;
            max-width: 220px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .btn-delete-action {
            background: #fff5f5;
            color: #e53e3e;
            border: 1px solid #fed7d7;
            padding: 6px 12px;
            font-size: 0.8rem;
            font-weight: 600;
            border-radius: 8px;
            transition: all 0.15s ease;
          }

          .btn-delete-action:hover {
            background: #e53e3e;
            color: white;
            border-color: #e53e3e;
          }

          .empty-state {
            padding: 40px;
            text-align: center;
            color: #94a3b8;
            font-size: 0.95rem;
          }
            .pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 6px;
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

        <div className="container page-fade-in">
          {/* Header Block */}
          <div className="mb-4">
            <h3 className="section-title">Doctor Leave Administration</h3>
            <p className="text-muted small mb-0">File new scheduling exceptions and monitor systemic medical leave registry tracking timelines.</p>
          </div>

          <div className="row g-4">
            {/* Left Column: Form Sidebar Container */}
            <div className="col-lg-4">
              <div className="clinic-card">
                <h5 className="fw-bold mb-3" style={{ color: '#1f3f35', fontSize: '1.1rem' }}>Log Leave Exception</h5>
                <form onSubmit={saveLeave}>
                  
                  <div>
                    <label className="form-label">Assign Provider</label>
                    <select
                      className="clinic-select"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Recurrent Shift Block</label>
                    <select
                      className="clinic-select"
                      name="working_day"
                      value={formData.working_day}
                      onChange={handleChange}
                    >
                      <option value="">Select Day (Optional)</option>
                      <option value="MONDAY">Monday</option>
                      <option value="TUESDAY">Tuesday</option>
                      <option value="WEDNESDAY">Wednesday</option>
                      <option value="THURSDAY">Thursday</option>
                      <option value="FRIDAY">Friday</option>
                      <option value="SATURDAY">Saturday</option>
                      <option value="SUNDAY">Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Calendar Exception Date</label>
                    <input
                      type="date"
                      className="clinic-input"
                      name="leave_date"
                      value={formData.leave_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Official Documentation Reason</label>
                    <input
                      type="text"
                      className="clinic-input"
                      name="reason"
                      placeholder="e.g., Medical Conference Attendee"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-save mt-2">
                    Commit Leave Exemption
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Live Data Display Table */}
            <div className="col-lg-8">
              <div className="clinic-card h-100 d-flex flex-column">
                <h5 className="fw-bold mb-3" style={{ color: '#1f3f35', fontSize: '1.1rem' }}>Active Absence Registers</h5>
                
                {leaves.length === 0 ? (
                  <div className="empty-state border rounded-3 d-flex flex-column align-items-center justify-content-center flex-grow-1">
                    <span>📅 No leave exemptions are current registered in the database system.</span>
                  </div>
                ) : (
                <div className="custom-table-container context-table flex-grow-1 bg-white">
                    <table className="table clinic-table adaptive-layout">
                      <thead>
                        <tr>
                          <th>Medical Practitioner</th>
                          <th>Exemption Date</th>
                          <th>Justification Notes</th>
                          <th className="text-end">Management</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentLeaves.map(item => (
                          <tr key={item.id}>
                            <td className="fw-semibold" style={{ color: '#1e293b' }}>
                              {item.doctor_name || "Assigned Provider"}
                            </td>
                            <td>
                              <span className="fw-medium text-secondary">{item.leave_date}</span>
                            </td>
                            <td>
                              <span className="badge-reason" title={item.reason}>
                                {item.reason || "No specification provided"}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn-delete-action"
                                onClick={() => deleteLeave(item.id)}
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorLeave;