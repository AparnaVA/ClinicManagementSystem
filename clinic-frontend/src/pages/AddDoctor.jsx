import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function AddDoctor() {

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
        const handleChange = (e) => {  setFormData({

                ...formData,

                [e.target.name]: e.target.value
            });
        };
        const handleSubmit =
    async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem(
                    'token'
                );

            await api.post(

                'doctors/create/',

                formData,

                {
                    headers: {

                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

            alert(
                'Doctor Added'
            );

            navigate(
                '/doctors'
            );

        } catch (error) {

            console.log(error);
        }
        };
        return (

            <>
            <Navbar />

            <div className="container mt-4">

            <h2>Add Doctor</h2>

            <form onSubmit={ handleSubmit } >

            <input
                type="text"
                name="name"
                placeholder='Name'
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="text"
                name="specialization"
                placeholder='Specialization'
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="text"
                name="phone"
                placeholder='Phone'
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="email"
                name="email"
                placeholder='Email'
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="text"
                name="qualification"
                placeholder='Qualification'
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="number"
                step="0.01"
                name="consultation_fee"
                placeholder='Consultation_fee'
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="date"
                name="joining_date"
                className="form-control mb-2"
                onChange={handleChange}
            />

            <button
                className="btn btn-success"
            >
            Save
            </button>

        </form>

    </div>
    </>
);
}

export default AddDoctor;