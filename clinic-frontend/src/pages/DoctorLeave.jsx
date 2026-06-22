import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function DoctorLeave(){
    const [doctors, setDoctors] = useState([]);

    const [leaves, setLeaves] = useState([]);

    const [formData, setFormData] = useState({

        doctor: '',
        leave_date: '',
        reason: ''
    });

    const LoadLeaves = async() => {
        try{
            const token = localStorage.getItem('token');
            const response = await api.get('doctors/leave/list',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            setLeaves(response.data);
        }
        catch (error){
            console.log(error);
        }
    }

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

    useEffect (() => {
        loadDoctors();
        LoadLeaves();
    }, []);

    const handleChange = (e) => {

    setFormData({

        ...formData,

        [e.target.name]:
        e.target.value
    });
};

const saveLeave = async (e) => {

    e.preventDefault();

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        await api.post(

            'doctors/leave/create/',

            formData,

            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        LoadLeaves();

        setFormData({

            doctor: '',

            leave_date: '',

            reason: ''
        });

    } catch (error) {

        console.log(error);
    }
};

const deleteLeave = async (id) => {

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        await api.delete(

            `doctors/leave/delete/${id}/`,

            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        LoadLeaves();

    } catch (error) {

        console.log(error);
    }
};

return(
    <>
    <Navbar />
    <div className="container">
        <form onSubmit={saveLeave}>
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
                type="date"
                name="leave_date"
                value={formData.leave_date}
                onChange={handleChange}
            />

            <input
                type="text"
                name="reason"
                value={formData.reason}
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

                <th>Leave Date</th>

                <th>Reason</th>

                <th>Action</th>

            </tr>

            </thead>

            <tbody>

            {
                leaves.map(
                    leaves => (

                    <tr
                        key={leaves.id}
                    >

        <td>
            {leaves.doctor_name}
        </td>

        <td>
            {leaves.leave_date}
        </td>

        <td>
            {leaves.reason}
        </td>

        <td>
            <button
                className="btn btn-danger"
                onClick={() =>
                    deleteLeave(
                        leaves.id
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
export default DoctorLeave;