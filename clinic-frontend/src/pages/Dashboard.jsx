import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {

  const [ data, setData ] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await api.get('dashboard/summary/',
          {headers:{
            Authorization :`Bearer ${token}`
          }}
        );
        setData(response.data);
        console.log(response);
      }
      catch(error){
        console.log(error);
      }
    };
    fetchDashboard();
  }, []);
  if (!data) {

    return <h3>Loading...</h3>;
}

  return (
    <>
    <Navbar />
    <div
      className="container mt-5"
    >

      <h2>
        Dashboard
      </h2>
      <div className="row">

    <div className="col-md-3">

        <div className="card">

            <div
                className="card-body"
            >

                <h5>
                    Total Patients
                </h5>

                <h3>
                    {data.total_patients}
                </h3>

            </div>

        </div>

    </div>

</div>

    </div>
    </>
  );
}

export default Dashboard