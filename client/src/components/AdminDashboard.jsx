import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [hrUsers, setHrUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newHr, setNewHr] = useState({
        username: '',
        password: '',
        employeeId: '',
        department: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const hrResponse = await axios.get('http://localhost:5000/api/auth/admin/hr', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHrUsers(hrResponse.data);

            const empResponse = await axios.get('http://localhost:5000/api/auth/admin/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(empResponse.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddHr = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/admin/hr', newHr, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewHr({ username: '', password: '', employeeId: '', department: '' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data.message || 'Failed to add HR user');
        }
    };

    const handleRemoveHr = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/auth/admin/hr/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            setError('Failed to remove HR user');
        }
    };

    const handleRemoveEmployee = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/auth/admin/employee/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            setError('Failed to remove employee');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Admin Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <section className="mb-4">
                        <h3>HR Users</h3>
                        <ul className="list-group">
                            {hrUsers.map(hr => (
                                <li key={hr._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {hr.username} - {hr.employeeId} - {hr.department}
                                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveHr(hr._id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <form className="mt-3" onSubmit={handleAddHr}>
                            <h4>Add HR User</h4>
                            <div className="mb-2">
                                <input
                                    type="email"
                                    placeholder="Username (Email)"
                                    className="form-control"
                                    value={newHr.username}
                                    onChange={e => setNewHr({ ...newHr, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="form-control"
                                    value={newHr.password}
                                    onChange={e => setNewHr({ ...newHr, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Employee ID"
                                    className="form-control"
                                    value={newHr.employeeId}
                                    onChange={e => setNewHr({ ...newHr, employeeId: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Department"
                                    className="form-control"
                                    value={newHr.department}
                                    onChange={e => setNewHr({ ...newHr, department: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Add HR</button>
                        </form>
                    </section>

                    <section>
                        <h3>Employees</h3>
                        <ul className="list-group">
                            {employees.map(emp => (
                                <li key={emp._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {emp.username} - {emp.employeeId} - {emp.department}
                                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveEmployee(emp._id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
