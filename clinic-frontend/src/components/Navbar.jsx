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
                    className="nav-link"
                    to="/patients"
                >
                    Patients
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