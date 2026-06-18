import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function Appointments() {

    const [appointments, setAppointments] = useState([]);
   
    useEffect(() => {
    fetchAppointments();
}, []);

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

                await api.put(

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
        return (

        <>
        <Navbar />

        <div className="container mt-4">

        <h2> Appointments </h2>

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