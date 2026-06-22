import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        navigate("/");
    };

    return (

        <nav
            className="navbar navbar-dark bg-dark"
        >

            <div className="container-fluid">

                <span
                    className="navbar-brand"
                >
                    Clinic Management
                </span>

                <Link
                    className="nav-link text-white"
                    to="/patients"
                >
                    Patients
                </Link>

                <Link
                    className="nav-link text-white"
                    to="/doctors"
                >
                    Doctors
                </Link>

                 <Link
                    className="nav-link text-white"
                    to="/appointments/add"
                >
                    Add Appointment
                </Link>

                <Link
                    className="nav-link text-white"
                    to="/appointments"
                >
                    Appointments
                </Link>

                <Link
                    className="nav-link text-white"
                    to="/doctorAvailable"
                >
                    Doctor Availability
                </Link>

                <Link
                    className="nav-link text-white"
                    to="/doctorLeave"
                >
                    Doctor Leave
                </Link>
                <Link
                    to="/calendar"
                >
                    Calendar
                </Link>

                <button
                    className="btn btn-danger"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;