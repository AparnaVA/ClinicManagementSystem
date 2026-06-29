import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function AddDoctor() {
    const navigate = useNavigate();
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        qualification: '',
        phone: '',
        email: '',
        consultation_fee: '',
        joining_date: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.specialization || !formData.qualification || !formData.phone || !formData.email || !formData.consultation_fee || !formData.joining_date) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' });
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return;
        }

        if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number' });
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.post('doctors/create/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: 'success', text: 'Doctor added successfully! Redirecting...' });
            setTimeout(() => {
                navigate('/doctors');
            }, 1500);
        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add doctor. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="add-doctor-page">
                <div className="container">
                    <div className="page-header">
                        <div className="header-content">
                            <div className="header-icon">📅</div>
                            <div>
                                <h1 className="page-title">Add New Doctor</h1>
                                <p className="page-subtitle">Register a new doctor in the clinic management system</p>
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`status-message ${message.type === 'success' ? 'status-success' : 'status-error'}`}>
                            <span className="status-icon">{message.type === 'success' ? '✓' : '✕'}</span>
                            <span>{message.text}</span>
                        </div>
                    )}

                    <div className="doctor-card">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">📝</span> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control custom-input"
                                            placeholder="Enter doctor's full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">🎓</span> Specialization
                                        </label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            className="form-control custom-input"
                                            placeholder="e.g. Cardiology, Pediatrics"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">📜</span> Qualification
                                        </label>
                                        <input
                                            type="text"
                                            name="qualification"
                                            className="form-control custom-input"
                                            placeholder="e.g. MBBS, MD"
                                            value={formData.qualification}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">📱</span> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control custom-input"
                                            placeholder="10-digit phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">✉️</span> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control custom-input"
                                            placeholder="doctor@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">💵</span> Consultation Fee
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="consultation_fee"
                                            className="form-control custom-input"
                                            placeholder="Enter fee amount"
                                            value={formData.consultation_fee}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="field-icon">📅</span> Joining Date
                                        </label>
                                        <input
                                            type="date"
                                            name="joining_date"
                                            className="form-control custom-input"
                                            value={formData.joining_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-save"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : '✓ Save Doctor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <style>{`
                    .add-doctor-page {
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

                    .doctor-card {
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

                    .custom-input {
                        border: 2px solid #e8f3f0;
                        border-radius: 12px;
                        padding: 12px 16px;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        font-family: inherit;
                        background-color: #f9fcfb;
                    }

                    .custom-input:focus {
                        outline: none;
                        border-color: #3f6f5d;
                        background-color: white;
                        box-shadow: 0 0 0 3px rgba(63, 111, 93, 0.1);
                    }

                    .custom-input:hover {
                        border-color: #5a8874;
                        background-color: #f0faf8;
                    }

                    .form-actions {
                        display: flex;
                        gap: 12px;
                        margin-top: 32px;
                        justify-content: center;
                    }

                    .btn-save {
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

                    .btn-save:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(63, 111, 93, 0.4);
                    }

                    .btn-save:active:not(:disabled) {
                        transform: translateY(0);
                    }

                    .btn-save:disabled {
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
                        .add-doctor-page {
                            padding: 20px 15px;
                        }

                        .doctor-card {
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

                        .btn-save {
                            padding: 12px 32px;
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        </>
    );
}

export default AddDoctor;