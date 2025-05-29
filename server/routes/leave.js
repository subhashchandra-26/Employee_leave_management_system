const express = require('express');
const authMiddleware = require('../middleware/auth');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const router = express.Router();

// Submit leave request (Employee)
router.post('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employee') return res.status(403).json({ message: 'Access denied' });

    const { startDate, endDate, leaveType, reason } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const leaveRequest = new LeaveRequest({
            userId: user._id,
            employeeId: user.employeeId,
            department: user.department,
            startDate,
            endDate,
            leaveType,
            reason
        });

        await leaveRequest.save();
        res.status(201).json({ message: 'Leave request submitted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get own leave requests (Employee)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const requests = await LeaveRequest.find({ userId: req.user.id }).populate('userId', 'username employeeId department');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all leave requests (HR)
router.get('/all', authMiddleware, async (req, res) => {
    if (req.user.role !== 'hr') return res.status(403).json({ message: 'Access denied' });

    try {
        const requests = await LeaveRequest.find().populate('userId', 'username employeeId department');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update leave request status (HR)
router.put('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'hr') return res.status(403).json({ message: 'Access denied' });

    const { status } = req.body;
    try {
        const request = await LeaveRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        await request.save();
        res.json({ message: `Request ${status}` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
