import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HRDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('pending');

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/leave/all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRequests(res.data);
        } catch (err) {
            setError(err.response?.data.message || 'Failed to fetch requests');
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/leave/${id}`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchRequests();
        } catch (err) {
            setError(err.response?.data.message || 'Action failed');
        }
    };

    return (
        <div className="container mt-4">
            <h2>HR Dashboard</h2>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Requests
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Requests
                    </button>
                </li>
            </ul>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Pending Requests Tab */}
            {activeTab === 'pending' && (
                <div className="p-3 bg-light rounded shadow-sm">
                    <h4>Pending Leave Requests</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Employee ID</th>
                                <th>Department</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Type</th>
                                <th>Reason</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.filter(req => req.status === 'Pending').map(req => (
                                <tr key={req._id}>
                                    <td>{req.userId.username}</td>
                                    <td>{req.userId.employeeId}</td>
                                    <td>{req.userId.department}</td>
                                    <td>{new Date(req.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(req.endDate).toLocaleDateString()}</td>
                                    <td>{req.leaveType}</td>
                                    <td>{req.reason}</td>
                                    <td>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleAction(req._id, 'Approved')}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleAction(req._id, 'Denied')}
                                        >
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* All Requests Tab */}
            {activeTab === 'all' && (
                <div className="p-3 bg-white rounded shadow-sm">
                    <h4>All Leave Requests</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Employee ID</th>
                                <th>Department</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Type</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Submitted On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req._id}>
                                    <td>{req.userId?.username || 'Unknown'}</td>
                                    <td>{req.userId?.employeeId || 'N/A'}</td>
                                    <td>{req.userId?.department || 'N/A'}</td>
                                    <td>{new Date(req.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(req.endDate).toLocaleDateString()}</td>
                                    <td>{req.leaveType}</td>
                                    <td>{req.reason}</td>
                                    <td>{req.status}</td>
                                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default HRDashboard;
