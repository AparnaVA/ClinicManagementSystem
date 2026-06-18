import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function AddAppointment(){
    const [patients, setPatients] = useState([]);

    const [doctors, setDoctors] = useState([]);

    const [slots, setSlots] = useState([]);

    const [formData, setFormData] = useState({

        patient: '',
        doctor: '',
        appointment_date: '',
        appointment_time: '',
        reason: ''
    });

    useEffect(() => {

        loadPatients();

        loadDoctors();

    }, []);

    const loadPatients = async () => {

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
    };

    const loadDoctors = async () => {

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
    };

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value
        });
    };

    useEffect(() => {

        if (
            !formData.doctor ||
            !formData.appointment_date
        ) {
            return;
        }

        loadSlots();

    }, [
        formData.doctor,
        formData.appointment_date
    ]);

    const loadSlots = async () => {

        try {

            const token =
                localStorage.getItem(
                    'token'
                );

            const response =
                await api.get(

                `appointments/available-slots/?doctor_id=${formData.doctor}&appointment_date=${formData.appointment_date}`,

                    {
                        headers: {
                            Authorization:
                            `Bearer ${token}`
                        }
                    }
                );

            setSlots(
                response.data.available_slots
            );

        } catch (error) {

            console.log(error);

            setSlots([]);
        }
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

                'appointments/create/',

                formData,

                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

            alert(
                'Appointment Booked'
            );

        } catch (error) {

            console.log(error);

            alert(
                'Booking Failed'
            );
        }
    };

    return(
        <>
        <Navbar />
        <div className="container">
            <h1>Add Appointments</h1>
        <form onSubmit={handleSubmit}>
        <select
            name="patient"
            className="form-control mb-3"
            value={formData.patient}
            onChange={handleChange}
        >

        <option value="">
        Select Patient
        </option>

        {
            patients.map(
            (patient) => (

            <option
                key={patient.id}
                value={patient.id}
            >

                {patient.name}

            </option>

        ))
    }

    </select>

    <select
        name="doctor"
        className="form-control mb-3"
        value={formData.doctor}
        onChange={handleChange}
    >

    <option value="">
    Select Doctor
    </option>

    {
        doctors.map(
            (doctor) => (

            <option
                key={doctor.id}
                value={doctor.id}
            >

                {doctor.name}

            </option>

        ))
    }

    </select>

    <input
        type="date"
        name="appointment_date"
        className="form-control mb-3"
        value={formData.appointment_date}
        onChange={handleChange}
    />

    <select
        name="appointment_time"
        className="form-control mb-3"
        value={formData.appointment_time}
        onChange={handleChange}
    >

    <option value="">
    Select Slot
    </option>

    {
        slots.map(
            (slot) => (

            <option
                key={slot}
                value={slot}
            >

                {slot}

            </option>

        ))
    }

    </select>

    <textarea
        name="reason"
        className="form-control mb-3"
        value={formData.reason}
        onChange={handleChange}
    />

    <button
        className="btn btn-success"
    >
        Book Appointment
    </button>
    </form>
    </div>
        </>
    )

}
export default AddAppointment