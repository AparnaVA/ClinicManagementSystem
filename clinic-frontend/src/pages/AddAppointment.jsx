import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function AddAppointment(){
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        patient: '',
        doctor: '',
        appointment_date: '',
        appointment_time: '',
        reason: ''
    });

    useEffect(() => {
        loadPatients();
        loadDoctors();
    }, []);

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        if (!formData.doctor || !formData.appointment_date) {
            return;
        }
        loadSlots();
    }, [formData.doctor, formData.appointment_date]);

    const loadSlots = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(
                `appointments/available-slots/?doctor_id=${formData.doctor}&appointment_date=${formData.appointment_date}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSlots(response.data.available_slots);
        } catch (error) {
            console.log(error);
            setSlots([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.patient || !formData.doctor || !formData.appointment_date || !formData.appointment_time) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' });
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.post('appointments/create/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: 'success', text: 'Appointment booked successfully!' });
            setFormData({
                patient: '',
                doctor: '',
                appointment_date: '',
                appointment_time: '',
                reason: ''
            });
            setSlots([]);

            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to book appointment. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="add-appointment-page">
                <div className="container">
                    <div className="page-header">
                        <div className="header-content">
                            <div className="header-icon">📅</div>
                            <div>
                                <h1 className="page-title">Book Appointment</h1>
                                <p className="page-subtitle">Schedule a consultation with our healthcare professionals</p>
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`status-message ${message.type === 'success' ? 'status-success' : 'status-error'}`}>
                            <span className="status-icon">{message.type === 'success' ? '✓' : '✕'}</span>
                            <span>{message.text}</span>
                        </div>
                    )}

                    <div className="appointment-card">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">👤</span> Select Patient
                                        </label>
                                        <select
                                            name="patient"
                                            className="form-control custom-select"
                                            value={formData.patient}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Choose Patient --</option>
                                            {patients.map((patient) => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">👨‍⚕️</span> Select Doctor
                                        </label>
                                        <select
                                            name="doctor"
                                            className="form-control custom-select"
                                            value={formData.doctor}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Choose Doctor --</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">📆</span> Appointment Date
                                        </label>
                                        <input
                                            type="date"
                                            name="appointment_date"
                                            className="form-control custom-input"
                                            value={formData.appointment_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">🕐</span> Select Time Slot
                                        </label>
                                        <select
                                            name="appointment_time"
                                            className="form-control custom-select"
                                            value={formData.appointment_time}
                                            onChange={handleChange}
                                            required
                                            disabled={slots.length === 0}
                                        >
                                            <option value="">-- Choose Time Slot --</option>
                                            {slots.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                        {slots.length === 0 && formData.doctor && formData.appointment_date && (
                                            <small className="text-muted" style={{ display: 'block', marginTop: '6px' }}>
                                                ℹ️ No slots available for this doctor on selected date
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">📝</span> Reason for Visit (Optional)
                                        </label>
                                        <textarea
                                            name="reason"
                                            className="form-control custom-textarea"
                                            rows="4"
                                            placeholder="Describe your symptoms, concerns, or reason for visit..."
                                            value={formData.reason}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-appointment"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Booking...' : 'Book Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <style>{`
                    .add-appointment-page {
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

                    .appointment-card {
                        background: white;
                        border-radius: 24px;
                        padding: 40px;
                        box-shadow: 0 8px 32px rgba(31, 63, 53, 0.12);
                        animation: slideUp 0.5s ease;
                    }

                    .form-group {
                        display: flex;
                        flex-direction: column;
                    }

                    .form-label {
                        color: #1f3f35;
                        font-weight: 600;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 0.95rem;
                    }

                    .field-icon {
                        font-size: 1.1rem;
                    }

                    .custom-select,
                    .custom-input,
                    .custom-textarea {
                        border: 2px solid #e8f3f0;
                        border-radius: 12px;
                        padding: 12px 16px;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        font-family: inherit;
                        background-color: #f9fcfb;
                    }

                    .custom-select:focus,
                    .custom-input:focus,
                    .custom-textarea:focus {
                        outline: none;
                        border-color: #3f6f5d;
                        background-color: white;
                        box-shadow: 0 0 0 3px rgba(63, 111, 93, 0.1);
                    }

                    .custom-select:hover:not(:disabled),
                    .custom-input:hover,
                    .custom-textarea:hover {
                        border-color: #5a8874;
                        background-color: #f0faf8;
                    }

                    .custom-select:disabled {
                        opacity: 0.6;
                        background-color: #f5faf9;
                        cursor: not-allowed;
                    }

                    .custom-select option {
                        padding: 10px;
                        color: #1f3f35;
                    }

                    .custom-textarea {
                        resize: vertical;
                        min-height: 120px;
                    }

                    .form-actions {
                        display: flex;
                        gap: 12px;
                        margin-top: 32px;
                        justify-content: center;
                    }

                    .btn-appointment {
                        background: linear-gradient(135deg, #3f6f5d 0%, #5a8874 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 14px 48px;
                        font-weight: 600;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(63, 111, 93, 0.3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .btn-appointment:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(63, 111, 93, 0.4);
                    }

                    .btn-appointment:active:not(:disabled) {
                        transform: translateY(0);
                    }

                    .btn-appointment:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
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
                        .add-appointment-page {
                            padding: 20px 15px;
                        }

                        .appointment-card {
                            padding: 24px;
                        }

                        .page-title {
                            font-size: 1.5rem;
                        }

                        .page-subtitle {
                            font-size: 0.9rem;
                        }

                        .header-icon {
                            font-size: 2rem;
                        }

                        .btn-appointment {
                            padding: 12px 32px;
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        </>
    );
}

export default AddAppointment;