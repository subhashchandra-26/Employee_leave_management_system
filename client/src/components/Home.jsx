import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div 
            className="container mt-5 text-center"
        >
            <h1 className="mb-4 text-white">Welcome to Employee Leave Management</h1>
            <p className="lead mb-5 text-white">
                Apply for leave, track requests, and manage approvals easily with our intuitive system.
            </p>
            <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-outline-light btn-lg">Login</Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">Register</Link>
            </div>
        </div>
    );
};

export default Home;
