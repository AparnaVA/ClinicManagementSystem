import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

    useEffect(() => {

    fetchDoctor();

}, []);

    const fetchDoctor = async () => {

    try {

        const token = localStorage.getItem('token');

        const response =
            await api.get(

                `doctors/${id}/`,

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

            `doctors/update/${id}/`,

            formData,

            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        alert(
            'Doctor Updated'
        );

        navigate(
            '/doctors'
        );

    } catch (error) {

        console.log(error);
    }
};

function cancelEdit(){
    fetchDoctor();
}
return(
    <>
    <Navbar />

            <div className="container mt-4">

            <h2>Edit Doctor</h2>

            <form onSubmit={ handleSubmit } >

            <input
                type="text"
                name="name"
                value={formData.name}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="text"
                name="specialization"
                value={formData.specialization}
                className="form-control mb-2"
                onChange={handleChange}
            />

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

            <input
                type="text"
                name="qualification"
                value={formData.qualification}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="number"
                step="0.01"
                name="consultation_fee"
                value={formData.consultation_fee}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <input
                type="date"
                name="joining_date"
                value={formData.joining_date}
                className="form-control mb-2"
                onChange={handleChange}
            />

            <button
                className="btn btn-success"
            >
                Update
            </button>

            <Link to="/doctors" className="btn btn-secondary">
            
                Cancel
            </Link>

        </form>

    </div>
    </>
)
    }
export default EditDoctor;