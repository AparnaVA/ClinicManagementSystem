import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from '../api/axios';

function DoctorAvailability(){
    const [doctors, setDoctors] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);

    const [formData, setFormData] = useState({
        doctor: '',
        working_day: '',
        start_time: '',
        end_time: ''
    });

    const loadDoctors = async () => {

    const token =
        localStorage.getItem('token');

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

const loadAvailabilities = async () => {

    const token =
        localStorage.getItem('token');

    const response =
        await api.get(

            'doctors/availability/list/',

            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

    setAvailabilities(
        response.data
    );
};
useEffect(() => {

    loadDoctors();

    loadAvailabilities();

}, []);
const handleChange = (e) => {

    setFormData({

        ...formData,

        [e.target.name]:
        e.target.value
    });
};
const saveAvailability =
async (e) => {

    e.preventDefault();

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        await api.post(

            'doctors/availability/create/',

            formData,

            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        loadAvailabilities();

    } catch (error) {

        console.log(error);
    }
};
    const deleteAvailability =
async (id) => {

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        await api.delete(

            `doctors/availability/delete/${id}/`,

            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        loadAvailabilities();

    } catch (error) {

        console.log(error);
    }
};


return(
    <>
    <Navbar />
    <div className="container">
        <form onSubmit={saveAvailability}>
            <select
                name="doctor"
                
                value={formData.doctor}
                onChange={handleChange}
            >

            <option value="">
            Select Doctor
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
          
            
            <select
                name="working_day"
                value={formData.working_day}
                onChange={handleChange}
            >

            <option value="">
            Select Day
            </option>

            <option value="MONDAY">
            Monday
            </option>

            <option value="TUESDAY">
            Tuesday
            </option>

            <option value="WEDNESDAY">
            Wednesday
            </option>

            <option value="THURSDAY">
            Thursday
            </option>

            <option value="FRIDAY">
            Friday
            </option>

            <option value="SATURDAY">
            Saturday
            </option>

            <option value="SUNDAY">
            Sunday
            </option>

            </select>
        
           
            <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
            />
          
            
            <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
            />
            
            <button
                type="submit"
            >
                Save
            </button>
                    </form>
    </div>

    
    <div className="container">
        <table className="table">

<thead>

<tr>

<th>Doctor</th>

<th>Day</th>

<th>Start</th>

<th>End</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{
    availabilities.map(
        availability => (

        <tr
            key={availability.id}
        >

        <td>
            {availability.doctor_name}
        </td>

        <td>
            {availability.working_day}
        </td>

        <td>
            {availability.start_time}
        </td>

        <td>
            {availability.end_time}
        </td>
        <td>
            <button
                className="btn btn-danger"
                onClick={() =>
                    deleteAvailability(
                        availability.id
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
)
}
export default DoctorAvailability;