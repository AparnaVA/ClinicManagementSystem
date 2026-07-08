import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function EditDoctor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        qualification: '',
        phone: '',
        email: '',
        consultation_fee: '',
        joining_date: ''
    });

    const fetchDoctor = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`doctors/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.put(`doctors/update/${id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Doctor Profile Updated Successfully');
            navigate('/doctors');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="edit-doctor-page page-fade-in">
                <style>{`
                    .edit-doctor-page {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f4f7f5 0%, #edf3f0 100%);
                        padding: 40px 0 60px;
                        font-family: 'Inter', system-ui, sans-serif;
                        color: #334155;
                    }

                    /* --- Component Entrance Smooth Fade --- */
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

                    /* --- Form Layout Card Wrap --- */
                    .form-card {
                        background: #ffffff;
                        border: 1px solid rgba(47, 91, 74, 0.08);
                        border-radius: 16px;
                        box-shadow: 0 6px 20px rgba(31, 63, 53, 0.03);
                        max-width: 750px;
                        margin: 0 auto;
                        padding: 36px;
                    }

                    .page-title {
                        color: #1f3f35;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                    }

                    /* --- Grid Subdivisions --- */
                    .form-grid-layout {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                    }

                    .full-width-field {
                        grid-column: span 2;
                    }

                    @media (max-width: 640px) {
                        .form-grid-layout {
                            grid-template-columns: 1fr;
                        }
                        .full-width-field {
                            grid-column: span 1;
                        }
                    }

                    /* --- Clean Input Field Blocks --- */
                    .input-group-custom {
                        margin-bottom: 4px;
                    }

                    .form-label {
                        font-size: 0.825rem;
                        font-weight: 600;
                        color: #000000;
                        margin-bottom: 6px;
                        display: block;
                    }

                    .clinic-input {
                        display: block;
                        width: 100%;
                        padding: 10px 14px;
                        font-size: 0.9rem;
                        color: #334155;
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 10px;
                        transition: all 0.15s ease-in-out;
                    }

                    .clinic-input:focus {
                        background-color: #ffffff;
                        border-color: #2f5b4a;
                        outline: 0;
                        box-shadow: 0 0 0 3px rgba(47, 91, 74, 0.12);
                    }

                    /* --- Action Sheet Control Triggers --- */
                    .action-row {
                        display: flex;
                        justify-content: flex-end;
                        gap: 12px;
                        margin-top: 32px;
                        border-top: 1px solid #f1f5f9;
                        padding-top: 24px;
                    }

                    .btn-save {
                        background: #2f5b4a !important;
                        color: white !important;
                        font-weight: 600;
                        font-size: 0.9rem;
                        padding: 10px 24px;
                        border: none;
                        border-radius: 10px;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 12px rgba(47, 91, 74, 0.15);
                    }

                    .btn-save:hover {
                        background: #1f3f35 !important;
                        transform: translateY(-1px);
                    }

                    .btn-cancel {
                        background: #ffffff !important;
                        color: #64748b !important;
                        border: 1px solid #cbd5e1 !important;
                        font-weight: 600;
                        font-size: 0.9rem;
                        padding: 10px 24px;
                        border-radius: 10px;
                        transition: all 0.15s ease;
                        text-decoration: none;
                        display: inline-block;
                        text-align: center;
                    }

                    .btn-cancel:hover {
                        background: #f8fafc !important;
                        color: #334155 !important;
                        border-color: #94a3b8 !important;
                    }
                `}</style>

                <div className="container">
                    <div className="form-card">
                        {/* Title and Header Description */}
                        <div className="mb-4">
                            <h3 className="page-title mb-1">Edit Provider Profile</h3>
                            <p className="text-muted small mb-0">Update core professional qualifications, clinical specializations, structural scheduling rates, and contact details.</p>
                        </div>

                        {/* Form Body Layout */}
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid-layout">
                                <div className="input-group-custom">
                                    <label className="form-label">Practitioner Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="Dr. Rowan Vance"
                                    />
                                </div>

                                <div className="input-group-custom">
                                    <label className="form-label">Medical Specialization</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={formData.specialization}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Cardiology, Pediatrics"
                                    />
                                </div>

                                <div className="input-group-custom">
                                    <label className="form-label">Professional Qualifications</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. MD, PhD, MBBS"
                                    />
                                </div>

                                <div className="input-group-custom">
                                    <label className="form-label">Consultation Fee ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="consultation_fee"
                                        value={formData.consultation_fee}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="input-group-custom">
                                    <label className="form-label">Contact Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="Phone number"
                                    />
                                </div>

                                <div className="input-group-custom">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="doctor@clinic.com"
                                    />
                                </div>

                                <div className="input-group-custom full-width-field">
                                    <label className="form-label">Affiliation / Joining Date</label>
                                    <input
                                        type="date"
                                        name="joining_date"
                                        value={formData.joining_date}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Control Pathways Row */}
                            <div className="action-row">
                                <Link to="/doctors" className="btn-cancel">
                                    Cancel
                                </Link>
                                <button type="submit" className="btn-save">
                                    Update Credentials
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditDoctor;