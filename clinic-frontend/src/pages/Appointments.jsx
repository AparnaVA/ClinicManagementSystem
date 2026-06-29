import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 8;
    const [message, setMessage] = useState({ type: '', text: '' });
    const [searchData, setSearchData] = useState({
        patient: '',
        doctor: '',
        appointment_date: '',
        status: ''
    })
   
    useEffect(() => {
        fetchAppointments();
        loadPatients();
        loadDoctors();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        searchAppointments();
    }, [searchData]);

    const loadPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('patients/list/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(response.data);
        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: 'Failed to load patients' });
        }
    };

    const loadDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('doctors/list/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(response.data);
        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: 'Failed to load doctors' });
        }
    };

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('appointments/list/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: 'Failed to load appointments' });
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(`appointments/status/${id}/`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Appointment status updated successfully' });
            fetchAppointments();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: 'Failed to update appointment status' });
        }
    };
    const handleSearchChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const searchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const hasFilters = searchData.patient || searchData.doctor || searchData.appointment_date || searchData.status;
            if (!hasFilters) {
                fetchAppointments();
                return;
            }
            const response = await api.get('appointments/search/', {
                params: searchData,
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: 'Failed to search appointments' });
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'SCHEDULED': { bg: '#e3f2fd', color: '#1976d2', icon: '📅' },
            'COMPLETED': { bg: '#e8f5e9', color: '#388e3c', icon: '✓' },
            'CANCELLED': { bg: '#ffebee', color: '#d32f2f', icon: '✕' },
            'NO_SHOW': { bg: '#fff3e0', color: '#f57c00', icon: '⚠' }
        };
        return statusMap[status] || { bg: '#f5f5f5', color: '#666', icon: '•' };
    };

    const startIndex = (currentPage - 1) * appointmentsPerPage;
    const currentAppointments = appointments.slice(startIndex, startIndex + appointmentsPerPage);
    const totalPages = Math.ceil(appointments.length / appointmentsPerPage);
    return (
        <>
            <Navbar />
            <div className="appointments-page">
                <div className="container">
                    <div className="page-header">
                        <div className="header-content">
                            <div className="header-icon">📅</div>
                            <div>
                                <h1 className="page-title">Appointments</h1>
                                <p className="page-subtitle">Manage and track all patient appointments</p>
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`status-message ${message.type === 'success' ? 'status-success' : 'status-error'}`}>
                            <span className="status-icon">{message.type === 'success' ? '✓' : '✕'}</span>
                            <span>{message.text}</span>
                        </div>
                    )}

                    <div className="appointments-card">
                        <div className="filter-section">
                            <h3 className="filter-title">🔍 Filter Appointments</h3>
                            <div className="row g-3">
                                <div className="col-md-6 col-lg-3">
                                    <label className="form-label">Patient</label>
                                    <select
                                        name="patient"
                                        className="form-control custom-select"
                                        value={searchData.patient}
                                        onChange={handleSearchChange}
                                    >
                                        <option value="">All Patients</option>
                                        {patients.map((patient) => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    <label className="form-label">Doctor</label>
                                    <select
                                        name="doctor"
                                        className="form-control custom-select"
                                        value={searchData.doctor}
                                        onChange={handleSearchChange}
                                    >
                                        <option value="">All Doctors</option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        name="appointment_date"
                                        className="form-control custom-input"
                                        value={searchData.appointment_date}
                                        onChange={handleSearchChange}
                                    />
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        name="status"
                                        className="form-control custom-select"
                                        value={searchData.status}
                                        onChange={handleSearchChange}
                                    >
                                        <option value="">All Status</option>
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                        <option value="NO_SHOW">No Show</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {currentAppointments.length > 0 ? (
                            <>
                                <div className="table-wrapper">
                                    <table className="appointments-table">
                                        <thead>
                                            <tr>
                                                <th>Patient</th>
                                                <th>Doctor</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                                <th>Reason</th>
                                                <th>Update Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentAppointments.map((appointment, index) => {
                                                const statusBadge = getStatusBadge(appointment.status);
                                                return (
                                                    <tr key={appointment.id} className={index % 2 === 0 ? 'even-row' : ''}>
                                                        <td className="patient-col">{appointment.patient_name}</td>
                                                        <td className="doctor-col">{appointment.doctor_name}</td>
                                                        <td className="date-col">{appointment.appointment_date}</td>
                                                        <td className="time-col">{appointment.appointment_time}</td>
                                                        <td>
                                                            <span className="status-badge" style={{
                                                                backgroundColor: statusBadge.bg,
                                                                color: statusBadge.color
                                                            }}>
                                                                {statusBadge.icon} {appointment.status}
                                                            </span>
                                                        </td>
                                                        <td className="reason-col" title={appointment.reason}>
                                                            {appointment.reason ? appointment.reason.substring(0, 30) + (appointment.reason.length > 30 ? '...' : '') : '—'}
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-control status-select"
                                                                value={appointment.status}
                                                                onChange={(e) => updateStatus(appointment.id, e.target.value)}
                                                            >
                                                                <option value="SCHEDULED">Scheduled</option>
                                                                <option value="COMPLETED">Completed</option>
                                                                <option value="CANCELLED">Cancelled</option>
                                                                <option value="NO_SHOW">No Show</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="pagination-section">
                                        <button
                                            className="btn btn-pagination"
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ← Previous
                                        </button>
                                        <div className="page-numbers">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            className="btn btn-pagination"
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <h3>No Appointments Found</h3>
                                <p>There are no appointments matching your filters. Try adjusting your search criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                <style>{`
                    .appointments-page {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f5faf9 0%, #e8f3f0 100%);
                        padding: 40px 20px;
                    }

                    .page-header {
                        margin-bottom: 40px;
                        animation: slideDown 0.5s ease;
                    }

                    .header-content {
                        display: flex;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .header-icon {
                        font-size: 2.5rem;
                        animation: bounce 0.6s ease;
                    }

                    .page-title {
                        color: #1f3f35;
                        font-size: 2rem;
                        font-weight: 700;
                        margin: 0 0 8px 0;
                        letter-spacing: -0.5px;
                    }

                    .page-subtitle {
                        color: #5a7a71;
                        font-size: 1rem;
                        margin: 0;
                        font-weight: 400;
                    }

                    .status-message {
                        padding: 16px 20px;
                        border-radius: 12px;
                        margin-bottom: 24px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        font-weight: 500;
                        animation: slideInDown 0.3s ease;
                    }

                    .status-success {
                        background-color: #e9f7f0;
                        color: #065f46;
                        border-left: 4px solid #3f6f5d;
                    }

                    .status-error {
                        background-color: #fef2f2;
                        color: #b42222;
                        border-left: 4px solid #dc2626;
                    }

                    .status-icon {
                        font-weight: 700;
                        font-size: 1.1rem;
                    }

                    .appointments-card {
                        background: white;
                        border-radius: 24px;
                        padding: 40px;
                        box-shadow: 0 8px 32px rgba(31, 63, 53, 0.12);
                        animation: slideUp 0.5s ease;
                    }

                    .filter-section {
                        margin-bottom: 32px;
                        padding-bottom: 24px;
                        border-bottom: 2px solid #f0f5f3;
                    }

                    .filter-title {
                        color: #1f3f35;
                        font-size: 1.1rem;
                        font-weight: 600;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .form-label {
                        color: #1f3f35;
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-size: 0.9rem;
                    }

                    .custom-select,
                    .custom-input {
                        border: 2px solid #e8f3f0;
                        border-radius: 10px;
                        padding: 10px 12px;
                        font-size: 0.95rem;
                        transition: all 0.3s ease;
                        background-color: #f9fcfb;
                    }

                    .custom-select:focus,
                    .custom-input:focus {
                        outline: none;
                        border-color: #3f6f5d;
                        background-color: white;
                        box-shadow: 0 0 0 3px rgba(63, 111, 93, 0.1);
                    }

                    .custom-select:hover,
                    .custom-input:hover {
                        border-color: #5a8874;
                    }

                    .table-wrapper {
                        overflow-x: auto;
                        margin-bottom: 24px;
                        border-radius: 12px;
                    }

                    .appointments-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 0.95rem;
                    }

                    .appointments-table thead {
                        background: linear-gradient(135deg, #3f6f5d 0%, #5a8874 100%);
                    }

                    .appointments-table thead th {
                        color: white;
                        padding: 16px;
                        font-weight: 600;
                        text-align: left;
                        border: none;
                        letter-spacing: 0.3px;
                    }

                    .appointments-table tbody tr {
                        border-bottom: 1px solid #f0f5f3;
                        transition: all 0.2s ease;
                    }

                    .appointments-table tbody tr:hover {
                        background-color: #f9fcfb;
                    }

                    .appointments-table tbody tr.even-row {
                        background-color: #f5faf9;
                    }

                    .appointments-table tbody td {
                        padding: 16px;
                        color: #2d4a43;
                        border: none;
                    }

                    .patient-col, .doctor-col {
                        font-weight: 500;
                    }

                    .reason-col {
                        max-width: 150px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 0.9rem;
                        color: #666;
                    }

                    .status-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 0.85rem;
                        font-weight: 600;
                        white-space: nowrap;
                    }

                    .status-select {
                        border: 1px solid #e8f3f0;
                        border-radius: 8px;
                        padding: 6px 8px;
                        font-size: 0.9rem;
                        cursor: pointer;
                        background-color: white;
                        transition: all 0.2s ease;
                    }

                    .status-select:hover {
                        border-color: #3f6f5d;
                    }

                    .status-select:focus {
                        outline: none;
                        border-color: #3f6f5d;
                        box-shadow: 0 0 0 2px rgba(63, 111, 93, 0.1);
                    }

                    .pagination-section {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        margin-top: 32px;
                        flex-wrap: wrap;
                    }

                    .btn-pagination {
                        background: linear-gradient(135deg, #3f6f5d 0%, #5a8874 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 10px 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .btn-pagination:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(63, 111, 93, 0.3);
                    }

                    .btn-pagination:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }

                    .page-numbers {
                        display: flex;
                        gap: 6px;
                        flex-wrap: wrap;
                    }

                    .page-btn {
                        min-width: 36px;
                        height: 36px;
                        border: 2px solid #e8f3f0;
                        background: white;
                        color: #1f3f35;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.2s ease;
                    }

                    .page-btn:hover {
                        border-color: #3f6f5d;
                        color: #3f6f5d;
                    }

                    .page-btn.active {
                        background: linear-gradient(135deg, #3f6f5d 0%, #5a8874 100%);
                        color: white;
                        border-color: #3f6f5d;
                    }

                    .empty-state {
                        text-align: center;
                        padding: 60px 20px;
                    }

                    .empty-icon {
                        font-size: 3rem;
                        margin-bottom: 16px;
                    }

                    .empty-state h3 {
                        color: #1f3f35;
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin: 0 0 8px 0;
                    }

                    .empty-state p {
                        color: #666;
                        font-size: 1rem;
                        margin: 0;
                    }

                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes slideInDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes bounce {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-8px);
                        }
                    }

                    @media (max-width: 991px) {
                        .appointments-page {
                            padding: 20px 15px;
                        }

                        .appointments-card {
                            padding: 24px;
                        }

                        .page-title {
                            font-size: 1.5rem;
                        }

                        .appointments-table {
                            font-size: 0.85rem;
                        }

                        .appointments-table thead th,
                        .appointments-table tbody td {
                            padding: 12px 8px;
                        }
                    }

                    @media (max-width: 767px) {
                        .table-wrapper {
                            overflow-x: auto;
                        }

                        .appointments-table {
                            font-size: 0.8rem;
                        }

                        .appointments-table thead th,
                        .appointments-table tbody td {
                            padding: 10px 6px;
                        }
                    }
                `}</style>
            </div>
        </>
    );
}
export default Appointments;