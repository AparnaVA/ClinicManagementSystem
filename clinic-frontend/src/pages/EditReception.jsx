import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function EditReception() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });

    const fetchReception = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`accounts/receptionists/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFormData({
                username: response.data.username || '',
                email: response.data.email || '',
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchReception();
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
            const payload = {
                username: formData.username,
                email: formData.email,
            };

            await api.put(`accounts/receptionists/update/${id}/`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Receptionist Updated Successfully');
            navigate('/reception');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="edit-reception-page page-fade-in">
                <style>{`
                    .edit-reception-page {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f4f7f5 0%, #edf3f0 100%);
                        padding: 60px 0;
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
                        max-width: 500px;
                        margin: 0 auto;
                        padding: 32px;
                    }

                    .page-title {
                        color: #1f3f35;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                    }

                    /* --- Clean Input Field Blocks --- */
                    .input-group-custom {
                        margin-bottom: 20px;
                    }

                    .form-label {
                        font-size: 0.825rem;
                        font-weight: 600;
                        color: #475569;
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
                        gap: 12px;
                        margin-top: 28px;
                    }

                    .btn-save {
                        flex: 1;
                        background: #2f5b4a !important;
                        color: white !important;
                        font-weight: 600;
                        font-size: 0.9rem;
                        padding: 11px;
                        border: none;
                        border-radius: 10px;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 12px rgba(47, 91, 74, 0.15);
                        text-align: center;
                    }

                    .btn-save:hover {
                        background: #1f3f35 !important;
                        transform: translateY(-1px);
                    }

                    .btn-cancel {
                        flex: 1;
                        background: #ffffff !important;
                        color: #64748b !important;
                        border: 1px solid #cbd5e1 !important;
                        font-weight: 600;
                        font-size: 0.9rem;
                        padding: 11px;
                        border-radius: 10px;
                        transition: all 0.15s ease;
                        text-align: center;
                        text-decoration: none;
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
                        <div className="mb-4 text-center">
                            <h3 className="page-title mb-1">Edit Receptionist Profile</h3>
                            <p className="text-muted small mb-0">Modify credential structures and contact parameters for front-desk personnel accounts.</p>
                        </div>

                        {/* Interactive Profile Mutation Panel */}
                        <form onSubmit={handleSubmit}>
                            <div className="input-group-custom">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    className="clinic-input"
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter username"
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
                                    placeholder="name@clinic.com"
                                />
                            </div>

                            {/* Control Pathways Row */}
                            <div className="action-row">
                                <Link to="/reception" className="btn-cancel">
                                    Cancel
                                </Link>
                                <button type="submit" className="btn-save">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditReception;