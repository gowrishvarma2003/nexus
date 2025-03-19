const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authorize } = require('../middlewares/auth');
const bcrypt = require('bcryptjs');

// Get all users (Admin only)
router.get('/', authorize('admin'), async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single user by ID (Admin only)
router.get('/:id', authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Invite a new user (Admin only)
// This endpoint uses a default password for simplicity.
router.post('/invite', authorize('admin'), async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const tempPassword = 'defaultPassword'; // In production, generate a random password and email it.
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.json({ message: 'User invited successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user details (Admin only)
router.put('/:id', authorize('admin'), async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a user (Admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
