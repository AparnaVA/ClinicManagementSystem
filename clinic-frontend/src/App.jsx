import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';

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

      </Routes>

    </BrowserRouter>
  )
}

export default App;