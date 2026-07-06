import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from '../api/axios';
import "./DoctorAvailability.css"; // Cleaned up styles below

function DoctorAvailability() {
    const [doctors, setDoctors] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [keyword, setKeyword] = useState(''); // Ready if you add a search input later
    const [currentPage, setCurrentPage] = useState(1);
    const doctorAvailablePerPage = 5;

    const [formData, setFormData] = useState({
        doctor: '',
        working_day: '',
        start_time: '',
        end_time: ''
    });

    const loadDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('doctors/list/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadAvailabilities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('doctors/availability/list/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailabilities(response.data);
        } catch (error) {
            console.log(error);
        }
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
            setCurrentPage(1); // Take user back to page 1 to see the new entry
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

    // --- Pagination Math Logic ---
    const totalPages = Math.ceil(availabilities.length / doctorAvailablePerPage);
    const startIndex = (currentPage - 1) * doctorAvailablePerPage;
    
    // FIXED: Using the sliced subset for rendering down in the return statement
    const currentDoctorAvailable = availabilities.slice(startIndex, startIndex + doctorAvailablePerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword, availabilities.length]);

    return (
        <div className="page-wrapper page-fade-in">
            <Navbar />
            
            <div className="dashboard-container container mt-4">
                {/* Descriptive Title Banner */}
                <div className="mb-4 description-header">
                    <h3 className="fw-bold" style={{ color: '#1f3f35', letterSpacing: '-0.02em' }}>Provider Availability Panels</h3>
                    <p className="text-muted small mb-0">Configure standard weekly shifts and duty operational times for your clinical staff.</p>
                </div>

                <div className="row g-4">
                    {/* Left Column: Form Section */}
                    <div className="col-lg-4">
                        <div className="clinic-card form-section">
                            <h5 className="form-card-title mb-3">Add Availability</h5>
                            <form onSubmit={saveAvailability}>
                                <div className="input-group-custom">
                                    <label className="form-label">Doctor</label>
                                    <select name="doctor" value={formData.doctor} onChange={handleChange} className="clinic-select" required>
                                        <option value="">Select Doctor</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group-custom">
                                    <label className="form-label">Working Day</label>
                                    <select name="working_day" value={formData.working_day} onChange={handleChange} className="clinic-select" required>
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

                                <div className="time-row row g-2">
                                    <div className="input-group-custom col-5">
                                        <label className="form-label">Start Time</label>
                                        <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} className="clinic-input" required />
                                    </div>
                                    <div className="input-group-custom col-5">
                                        <label className="form-label">End Time</label>
                                        <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} className="clinic-input" required />
                                    </div>
                                </div>

                                <button type="submit" className="btn-save w-100 mt-2">Save Schedule</button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Table Section */}
                    <div className="col-lg-8">
                        <div className="clinic-card table-section d-flex flex-column h-100">
                            <h5 className="form-card-title mb-3">Current Duty Schedules</h5>
                            
                            <div className="table-responsive-custom flex-grow-1">
                                <table className="clinic-table">
                                    <thead>
                                        <tr>
                                            <th>Doctor</th>
                                            <th>Day</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentDoctorAvailable.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="empty-state text-center py-5">
                                                    📅 No scheduled hours found.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentDoctorAvailable.map(availability => (
                                                <tr key={availability.id}>
                                                    <td className="doctor-name-cell">{availability.doctor_name}</td>
                                                    <td><span className="day-badge">{availability.working_day}</span></td>
                                                    <td className="time-cell">{availability.start_time}</td>
                                                    <td className="time-cell">{availability.end_time}</td>
                                                    <td className="text-end">
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

                            {/* Pagination UI Controls */}
                            {totalPages > 1 && (
                                <div className="pagination-wrap mt-3 d-flex justify-content-center gap-1">
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
            </div>
        </div>
    );
}

export default DoctorAvailability;