import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveRequestDashboard = ({ requests }) => (
    <div>
        <h3>Your Leave Requests</h3>
        <table className="table table-striped">
            <thead>
                <tr>
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
                        <td>{req.employeeId}</td>
                        <td>{req.department}</td>
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
);

const EmployeeDashboard = () => {
    const [form, setForm] = useState({
        employeeId: '',
        department: '',
        startDate: '',
        endDate: '',
        leaveType: 'Sick',
        reason: '',
    });

    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/leave', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRequests(res.data);
        } catch (err) {
            setError(err.response?.data.message || 'Failed to fetch requests');
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/leave', form, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setForm({
                employeeId: '',
                department: '',
                startDate: '',
                endDate: '',
                leaveType: 'Sick',
                reason: '',
            });
            fetchRequests();
        } catch (err) {
            setError(err.response?.data.message || 'Failed to submit request');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Employee Portal</h2>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        Your Leave Requests
                    </button>
                </li>
            </ul>

            {error && <div className="alert alert-danger">{error}</div>}

            {activeTab === 'dashboard' && (
                <div className="p-3 bg-light rounded shadow-sm">
                    <h3>Apply for Leave</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Employee ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.employeeId}
                                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.department}
                                onChange={(e) => setForm({ ...form, department: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Leave Type</label>
                            <select
                                className="form-control"
                                value={form.leaveType}
                                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                            >
                                <option value="Sick">Sick</option>
                                <option value="Vacation">Vacation</option>
                                <option value="Personal">Personal</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Reason</label>
                            <textarea
                                className="form-control"
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="p-3 bg-white rounded shadow-sm">
                    <LeaveRequestDashboard requests={requests} />
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
