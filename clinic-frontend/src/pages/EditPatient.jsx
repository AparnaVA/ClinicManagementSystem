import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

    useEffect(() => {

    fetchPatient();

}, []);

    const fetchPatient = async () => {

    try {

        const token = localStorage.getItem('token');

        const response =
            await api.get(

                `patients/${id}/`,

                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

        setFormData(
            response.data
        );

    } catch (error) {

        console.log(error);
    }
};
    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value
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

        await api.put(

            `patients/update/${id}/`,

            formData,

            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        alert(
            'Patient Updated'
        );

        navigate(
            '/patients'
        );

    } catch (error) {

        console.log(error);
    }
};

function cancelEdit(){
    fetchPatient();
}
return(
    <>
    <Navbar />

            <div className="container mt-4">

            <h2>Edit Patient</h2>

            <form onSubmit={ handleSubmit } >

            <input
                type="text"
                name="name"
                value={formData.name}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="number"
                name="age"
                value={formData.age}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <select
                name="gender"
                value={formData.gender}
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
                value={formData.phone}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="email"
                name="email"
                value={formData.email}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <textarea
                name="address"
                value={formData.address}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <button
                className="btn btn-success"
            >
                Update
            </button>

            <Link to="/patients" className="btn btn-secondary">
            
                Cancel
            </Link>

        </form>

    </div>
    </>
)
    }
export default EditPatient;