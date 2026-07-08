import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function EditPatient() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        emergency_contact: ''
    });

    const fetchPatient = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`patients/${id}/`, {
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
        fetchPatient();
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
            await api.put(`patients/update/${id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Patient Profile Updated Successfully');
            navigate('/patients');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="edit-patient-page page-fade-in">
                <style>{`
                    .edit-patient-page {
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

                    textarea.clinic-input {
                        resize: vertical;
                        min-height: 80px;
                    }

                    /* --- Action Sheet Control Triggers --- */
                    .action-row {
                        display: flex;
                        justify-content: flex-end;
                        gap: 12px;
                        margin-top: 10px;
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
                            <h3 className="page-title mb-1">Edit Patient Registry Profile</h3>
                            <p className="text-muted small mb-0">Modify essential medical documentation, communication keys, and situational tracking logs.</p>
                        </div>

                        {/* Interactive Dynamic Form Architecture */}
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid-layout">
                                <div className="input-group-custom">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="input-group-custom">
                                    <label className="form-label">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. 32"
                                    />
                                </div>

                                <div className="input-group-custom">
                                    <label className="form-label">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
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

                                <div className="input-group-custom ">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="patient@example.com"
                                    />
                                </div>

                                <div className="input-group-custom ">
                                    <label className="form-label">Emergency Contact Parameters</label>
                                    <input
                                        type="text"
                                        name="emergency_contact"
                                        value={formData.emergency_contact}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="Name & Relationship / Contact Number"
                                    />
                                </div>

                                <div className="input-group-custom full-width-field">
                                    <label className="form-label">Residential Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        className="clinic-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="Street details, City, Postcode"
                                    />
                                </div>

                                
                            </div>

                            {/* Control Pathways Row */}
                            <div className="action-row">
                                <Link to="/patients" className="btn-cancel">
                                    Cancel
                                </Link>
                                <button type="submit" className="btn-save">
                                    Update Records
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditPatient;