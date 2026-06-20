import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import Doctors from './pages/Doctors';
import AddDoctor from './pages/AddDoctor';
import EditDoctor from './pages/EditDoctor';
import AddAppointment from './pages/AddAppointment'
import Appointments from './pages/Appointments'
import DoctorAvailability from './pages/DoctorAvailability'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
              <ProtectedRoute>
                  <Patients />
              </ProtectedRoute>
          }
        />

        <Route
            path="/patients/add"
            element={
                <ProtectedRoute>
                    <AddPatient />
                </ProtectedRoute>
            }
        />

        <Route
            path="/patients/edit/:id"
            element={
                <ProtectedRoute>
                    <EditPatient />
                </ProtectedRoute>
            }
        />

        <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <Doctors />
          </ProtectedRoute>
        }>
        </Route>

        <Route
        path='/doctors/create'
        element={
          <ProtectedRoute>
            <AddDoctor />
          </ProtectedRoute>
        }
        >
        </Route>

        <Route
        path='/doctors/edit/:id'
        element={
          <ProtectedRoute>
            <EditDoctor />
          </ProtectedRoute>
        }
        >
        </Route>
        <Route
          path="/appointments/add"
          element={
              <ProtectedRoute>
                  <AddAppointment />
              </ProtectedRoute>
          }
      />

      <Route
        path="/appointments"
        element={
            <ProtectedRoute>
                <Appointments />
            </ProtectedRoute>
        }
    />

        <Route
        path="/doctorAvailable"
        element={
            <ProtectedRoute>
                <DoctorAvailability />
            </ProtectedRoute>
        }
    />

      </Routes>

    </BrowserRouter>
  )
}

export default App;