import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function Doctors(){
    const [doctors, setDoctors] = useState([]);
    const [keyword, setKeyword] = useState('');

    useEffect (()=> {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {

    try {

        const token = localStorage.getItem('token');

        const response = await api.get('doctors/list/',
                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

        setDoctors( response.data );

        } catch (error) {

            console.log(error);
        }
    }
        const deleteDoctor = async (id) => {

        if ( !window.confirm('Delete Doctor?')) {
            return;
        }

        try {

            const token = localStorage.getItem('token' );

            await api.delete(`doctor/delete/${id}/`, {
               
                headers: {

                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        fetchDoctors();

        } catch (error) {

            console.log(error);
        }
    };

    const searchDoctors =
async () => {

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        const response =
            await api.get(

                `doctors/search/?search=${keyword}`,

                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

        setDoctors(
            response.data
        );

    } catch (error) {

        console.log(error);
    }
};

useEffect(() => {

    if (
        keyword.trim() === ''
    ) {

        fetchDoctors();

        return;
    }

    searchDoctors();

}, [keyword]);


return(
    <>
    <Navbar />

    <div className="container mt-4">

        <div
    className="row mt-3"
>

    <div className="col-md-4">

        <input
            type="text"
            className="form-control"
            placeholder="Search Patient"
            value={keyword}
            onChange={(e) =>
                setKeyword(
                    e.target.value
                )
            }
        />

    </div>
</div>

        <div
            className="d-flex mt-4
            justify-content-between"
        >

            <h2>Doctors</h2>

            <Link
                to="/doctors/create"
                className=
                "btn btn-primary"
            >
                Add Doctor
            </Link>

        </div>

        <table
            className=
            "table table-bordered mt-3"
        >

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Qualification</th>
                    <th>Consultation fee</th>
                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {
                    doctors.map(
                        (doctor) => (

                        <tr
                            key={doctor.id}
                        >

                            <td>
                                {doctor.doctor_id}
                            </td>

                            <td>
                                {doctor.name}
                            </td>

                            <td>
                                {doctor.specialization}
                            </td>

                            <td>
                                {doctor.phone}
                            </td>

                            <td>
                                {doctor.email}
                            </td>

                            <td>
                                {doctor.qualification}
                            </td>

                            <td>
                                {doctor.consultation_fee}
                            </td>

                            <td>

                                <Link
                                    to={
                                    `/doctors/edit/${doctor.id}`
                                    }
                                    className=
                                    "btn btn-warning btn-sm"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm ms-2"

                                    onClick={() =>
                                        deleteDoctor(
                                            doctor.id
                                        )
                                    }
                                >
                                Delete
                                </button>


                            </td>

                        </tr>

                    ))
                }

            </tbody>

        </table>

    </div>
    </>
);

}

export default Doctors;