import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function Appointments() {

    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [searchData, setSearchData] = useState(
        {
            patient:'',
            doctor:'',
            appointment_date:'',
            status:''
        }
    )
   
    useEffect(() => {
        fetchAppointments();
        loadPatients();
        loadDoctors();
}, []);

useEffect(() => {

    searchAppointments();

}, [searchData]);

    const loadPatients =
async () => {

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        const response =
            await api.get(

                'patients/list/',

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

    const loadDoctors =
async () => {

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        const response =
            await api.get(

                'doctors/list/',

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

    const fetchAppointments =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        'token'
                    );

                const response =
                    await api.get(

                        'appointments/list/',

                        {
                            headers: {
                                Authorization:
                                `Bearer ${token}`
                            }
                        }
                    );

                setAppointments(
                    response.data
                );
                console.log(response.data)

            } catch (error) {

                console.log(error);
            }
        };

        const updateStatus =
            async ( id, status ) => {

            try {

                const token =
                    localStorage.getItem(
                        'token'
                    );

                await api.patch(

                    `appointments/status/${id}/`,

                    {
                        status
                    },

                    {
                        headers: {
                            Authorization:
                            `Bearer ${token}`
                        }
                    }
                );

                fetchAppointments();

            } catch (error) {

                console.log(error);
            }
        };
        const handleSearchChange = (e) => {

            setSearchData({

                ...searchData,

                [e.target.name]: e.target.value
            });
        };

        const searchAppointments = async () => {

    try {

        const token =
            localStorage.getItem('token');

        const hasFilters =

            searchData.patient ||
            searchData.doctor ||
            searchData.appointment_date ||
            searchData.status;

        if (!hasFilters) {

            fetchAppointments();

            return;
        }

        const response =
            await api.get(

                'appointments/search/',

                {
                    params: searchData,

                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

        setAppointments(
            response.data
        );

    } catch (error) {

        console.log(error);
    }
};
        return (

        <>
        <Navbar />

        <div className="container mt-4">

            <h2> Appointments </h2>

            <div className="row mb-3">

                <div className="col-3">

                <select
                    name="patient"
                    className="form-control"
                    value={searchData.patient}
                    onChange={handleSearchChange}
                >

                <option value="">
                All Patients
                </option>

                {
                    patients.map(
                        patient => (

                        <option
                            key={patient.id}
                            value={patient.id}
                        >
                            {patient.name}
                        </option>

                    ))
                }

            </select>

        </div>

        <div className="col-3">

            <select
                name="doctor"
                className="form-control"
                value={searchData.doctor}
                onChange={handleSearchChange}
            >

            <option value="">
            All Doctors
            </option>

            {
                doctors.map(
                    doctor => (

                    <option
                        key={doctor.id}
                        value={doctor.id}
                    >
                        {doctor.name}
                    </option>

                ))
            }

            </select>

        </div>

        <div className="col-3">

        <input
            type="date"
            name="appointment_date"
            className="form-control"
            value={searchData.appointment_date}
            onChange={handleSearchChange}
        />

        </div>

        <div className="col-3">

        <select
            name="status"
            className="form-control"
            value={searchData.status}
            onChange={handleSearchChange}
        >

        <option value="">
        All Status
        </option>

        <option value="SCHEDULED">
        Scheduled
        </option>

        <option value="COMPLETED">
        Completed
        </option>

        <option value="CANCELLED">
        Cancelled
        </option>

        <option value="NO_SHOW">
        No Show
        </option>

        </select>

        </div>

        <div className="col-12">

        </div>

        </div>

        <table
            className=
            "table table-bordered"
        >

        <thead>

        <tr>

            <th>Patient</th>

            <th>Doctor</th>

            <th>Date</th>

            <th>Time</th>

            <th>Status</th>

            <th>Reason</th>

            <th>Actions</th>

            </tr>

            </thead>

            <tbody>

            {
                appointments.map(
                (appointment) => (

                <tr key={appointment.id} >

                <td>{appointment.patient_name}</td>

                <td> {appointment.doctor_name} </td>

                <td>{appointment.appointment_date} </td>

                <td>{appointment.appointment_time} </td>

                <td>{appointment.status} </td>

                <td>{appointment.reason}</td>

                <td>

                    <select

                        className=
                        "form-control"

                        value={
                        appointment.status
                        }

                        onChange={(e) =>

                        updateStatus(
                        appointment.id,
                        e.target.value
                        )

                        }
                        >

                    <option
                    value="SCHEDULED"
                    >
                    Scheduled
                    </option>

                    <option
                    value="COMPLETED"
                    >
                    Completed
                    </option>

                    <option
                    value="CANCELLED"
                    >
                    Cancelled
                    </option>

                    <option
                    value="NO_SHOW"
                    >
                    No Show
                    </option>

                    </select>

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
export default Appointments;