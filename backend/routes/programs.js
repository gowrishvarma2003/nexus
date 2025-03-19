const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const { authMiddleware, authorize } = require('../middlewares/auth');

// Get all programs (all authenticated users)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const programs = await Program.find().populate('courses');
        res.json(programs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single program by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const program = await Program.findById(req.params.id).populate('courses');
        if (!program) return res.status(404).json({ message: 'Program not found' });
        res.json(program);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new program (Admin and Professors)
router.post('/', authorize(['admin', 'professor']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const newProgram = new Program({ name, description });
        await newProgram.save();
        res.json({ message: 'Program created successfully', program: newProgram });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a program (Admin and Professors)
router.put('/:id', authorize(['admin', 'professor']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const program = await Program.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        if (!program) return res.status(404).json({ message: 'Program not found' });
        res.json({ message: 'Program updated successfully', program });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a program (Admin and Professors)
router.delete('/:id', authorize(['admin', 'professor']), async (req, res) => {
    try {
        const program = await Program.findByIdAndDelete(req.params.id);
        if (!program) return res.status(404).json({ message: 'Program not found' });
        res.json({ message: 'Program deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
