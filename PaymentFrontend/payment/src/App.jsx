import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InitiatePayment from './components/InitiatePayment';
import ProcessPayment from './components/ProcessPayment';
import { ProtectedComponent } from './endpoint/ProtectedRoute';

function App() {
  const [count, setCount] = useState(0)
  const isAuthenticated = !!localStorage.getItem("access_token");
  return (
    <>
     <Router>
      <Routes>
      <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
          }
        />
        <Route path="/login" element={<Login />} />

        <Route
        path="/dashboard"
        element={
          <ProtectedComponent>
            <Dashboard />
          </ProtectedComponent>
        }
      />
        <Route path="/initialpayment" element={
              <ProtectedComponent>
              <InitiatePayment />

            </ProtectedComponent>
          } />

        <Route path="/processpayment" element={
              <ProtectedComponent>
              <ProcessPayment />

            </ProtectedComponent>
          } />
      
      <Route
        exact
        path="/"
        element={
          <ProtectedComponent>
            <Navigate to="/login" />
          </ProtectedComponent>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

    </Router>
    </>
  )
}

export default App
