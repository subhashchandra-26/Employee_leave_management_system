import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setRole }) => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setRole(null);
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand text-white fw-bold" to="/">
                    Employee Leave Management
                </Link>
                <div className="navbar-nav ms-auto">
                    {role && location.pathname !== '/' ? (
                        <button className="nav-link btn btn-outline-danger btn-lg" onClick={handleLogout}>Logout</button>
                    ): (
                        <>
                            <Link className="nav-link btn btn-outline-success btn-lg" to="/login">
                                Login
                            </Link>
                            <Link className="nav-link btn btn-outline-success btn-lg" to="/register">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
