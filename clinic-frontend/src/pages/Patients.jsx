import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function Patients(){
    const [patients, setPatients] = useState([]);
    const [keyword, setKeyword] = useState('');

    useEffect (()=> {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {

    try {

        const token = localStorage.getItem('token');

        const response = await api.get('patients/list/',
                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

        setPatients( response.data );

        } catch (error) {

            console.log(error);
        }
    }
        const deletePatient = async (id) => {

        if ( !window.confirm('Delete Patient?')) {
            return;
        }

        try {

            const token = localStorage.getItem('token' );

            await api.delete(`patients/delete/${id}/`, {
               
                headers: {

                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        fetchPatients();

        } catch (error) {

            console.log(error);
        }
    };

    const searchPatients =
async () => {

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        const response =
            await api.get(

                `patients/search/?search=${keyword}`,

                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

        setPatients(
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

        fetchPatients();

        return;
    }

    searchPatients();

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

    <div className="col-md-2">

    </div>


</div>

        <div
            className="d-flex
            justify-content-between"
        >

            <h2>Patients</h2>

            <Link
                to="/patients/add"
                className=
                "btn btn-primary"
            >
                Add Patient
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
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {
                    patients.map(
                        (patient) => (

                        <tr
                            key={patient.id}
                        >

                            <td>
                                {patient.patient_id}
                            </td>

                            <td>
                                {patient.name}
                            </td>

                            <td>
                                {patient.phone}
                            </td>

                            <td>
                                {patient.email}
                            </td>

                            <td>

                                <Link
                                    to={
                                    `/patients/edit/${patient.id}`
                                    }
                                    className=
                                    "btn btn-warning btn-sm"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm ms-2"

                                    onClick={() =>
                                        deletePatient(
                                            patient.id
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

export default Patients;