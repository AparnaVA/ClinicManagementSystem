import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function AddPatient() {

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

                'patients/create/',

                formData,

                {
                    headers: {

                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

            alert(
                'Patient Added'
            );

            navigate(
                '/patients'
            );

        } catch (error) {

            console.log(error);
        }
        };
        return (

            <>
            <Navbar />

            <div className="container mt-4">

            <h2>Add Patient</h2>

            <form onSubmit={ handleSubmit } >

            <input
                type="text"
                name="name"
                placeholder="Name"
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="number"
                name="age"
                placeholder="Age"
                className="form-control mb-2"
                onChange={handleChange}
            />

            <select
                name="gender"
                className="form-control mb-2"
                onChange={handleChange}
            >

            <option value="">
            Select Gender
            </option>

            <option value="Male">
            Male
            </option>

            <option value="Female">
            Female
            </option>

            </select>

            <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control mb-2"
                onChange={handleChange}
            />

            <textarea
                name="address"
                placeholder="Address"
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="text"
                name="emergency_contact"
                placeholder="Emergency Contact"
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

export default AddPatient;