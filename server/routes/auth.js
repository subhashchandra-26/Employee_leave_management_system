const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

// Admin authorization middleware
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};

// Register route - only allow employee role registration
router.post('/register', async (req, res) => {
    const { username, password, role, employeeId, department } = req.body;

    if (role !== 'employee') {
        return res.status(403).json({ message: 'Registration allowed only for employee role' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            password: hashedPassword,
            role,
            employeeId,
            department
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin routes

// Get list of HR users
router.get('/admin/hr', authMiddleware, adminAuth, async (req, res) => {
    try {
        const hrUsers = await User.find({ role: 'hr' }).select('-password');
        res.json(hrUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get list of employees
router.get('/admin/employees', authMiddleware, adminAuth, async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        res.json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add HR user
router.post('/admin/hr', authMiddleware, adminAuth, async (req, res) => {
    const { username, password, employeeId, department } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const hrUser = new User({
            username,
            password: hashedPassword,
            role: 'hr',
            employeeId,
            department
        });

        await hrUser.save();
        res.status(201).json({ message: 'HR user added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove HR user
router.delete('/admin/hr/:id', authMiddleware, adminAuth, async (req, res) => {
    try {
        const hrUser = await User.findOne({ _id: req.params.id, role: 'hr' });
        if (!hrUser) return res.status(404).json({ message: 'HR user not found' });

        await User.findByIdAndDelete(req.params.id)
        res.json({ message: 'HR user removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove employee
router.delete('/admin/employee/:id', authMiddleware, adminAuth, async (req, res) => {
    try {
        const employee = await User.findOne({ _id: req.params.id, role: 'employee' });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        await User.findByIdAndDelete(req.params.id)
        res.json({ message: 'Employee removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

module.exports = router;
