import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from '../api/axios';
import "./DoctorAvailability.css"; // Import the updated light-themed styles

function DoctorAvailability() {
    const [doctors, setDoctors] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [keyword, setKeyword] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const doctorAvailablePerPage = 5

    const [formData, setFormData] = useState({
        doctor: '',
        working_day: '',
        start_time: '',
        end_time: ''
    });

    const loadDoctors = async () => {
        const token = localStorage.getItem('token');
        const response = await api.get('doctors/list/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(response.data);
    };

    const loadAvailabilities = async () => {
        const token = localStorage.getItem('token');
        const response = await api.get('doctors/availability/list/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setAvailabilities(response.data);
    };

    useEffect(() => {
        loadDoctors();
        loadAvailabilities();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const saveAvailability = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('doctors/availability/create/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ doctor: '', working_day: '', start_time: '', end_time: '' });
            loadAvailabilities();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteAvailability = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await api.delete(`doctors/availability/delete/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadAvailabilities();
        } catch (error) {
            console.log(error);
        }
    };

    const totalPages = Math.ceil(availabilities.length / doctorAvailablePerPage)
    const startIndex = (currentPage - 1) * doctorAvailablePerPage
    const currentDoctorAvailable = availabilities.slice(startIndex, startIndex + doctorAvailablePerPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [keyword])

    return (
        <div className="page-wrapper">
            <Navbar />
            
            <div className="dashboard-container">
                {/* Form Card */}
                <div className="clinic-card form-section">
                    <h2 className="section-title">Add Availability</h2>
                    <form onSubmit={saveAvailability}>
                        <div className="input-group-custom">
                            <label>Doctor</label>
                            <select name="doctor" value={formData.doctor} onChange={handleChange} required>
                                <option value="">Select Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group-custom">
                            <label>Working Day</label>
                            <select name="working_day" value={formData.working_day} onChange={handleChange} required>
                                <option value="">Select Day</option>
                                <option value="MONDAY">Monday</option>
                                <option value="TUESDAY">Tuesday</option>
                                <option value="WEDNESDAY">Wednesday</option>
                                <option value="THURSDAY">Thursday</option>
                                <option value="FRIDAY">Friday</option>
                                <option value="SATURDAY">Saturday</option>
                                <option value="SUNDAY">Sunday</option>
                            </select>
                        </div>

                        <div className="time-row">
                            <div className="input-group-custom">
                                <label>Start Time</label>
                                <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
                            </div>
                            <div className="input-group-custom">
                                <label>End Time</label>
                                <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
                            </div>
                        </div>

                        <button type="submit" className="btn-save">Save Schedule</button>
                    </form>
                </div>

                {/* Table Card */}
                <div className="clinic-card table-section">
                    <h2 className="section-title">Current Duty Schedules</h2>
                    <div className="table-responsive-custom">
                        <table className="clinic-table">
                            <thead>
                                <tr>
                                    <th>Doctor</th>
                                    <th>Day</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availabilities.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-state">No scheduled hours found.</td>
                                    </tr>
                                ) : (
                                    availabilities.map(availability => (
                                        <tr key={availability.id}>
                                            <td className="doctor-name-cell">{availability.doctor_name}</td>
                                            <td><span className="day-badge">{availability.working_day}</span></td>
                                            <td className="time-cell">{availability.start_time}</td>
                                            <td className="time-cell">{availability.end_time}</td>
                                            <td>
                                                <button className="btn-action-delete" onClick={() => deleteAvailability(availability.id)}>
                                                    Delete
                                                </button>
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
    );
}

export default DoctorAvailability;