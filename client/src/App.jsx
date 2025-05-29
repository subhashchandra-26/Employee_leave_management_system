import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import HRDashboard from './components/HRDashboard';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './App.css';

function App() {
    const [role, setRole] = useState(localStorage.getItem('role') || null);

    return (
        <Router>
            <div className="App"
            style={{
                background: 'linear-gradient(to bottom, #00aaff, #ffffff)',
                minHeight: '100vh',
                margin: '0',
                fontFamily: 'Arial, sans-serif',
            }}
            >
                <Navbar setRole={setRole} />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/login" element={<Login setRole={setRole} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/employee" element={role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" />} />
                        <Route path="/hr" element={role === 'hr' ? <HRDashboard /> : <Navigate to="/login" />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;