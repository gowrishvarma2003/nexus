const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { authMiddleware, authorize } = require('../middlewares/auth');

// Get all courses (all authenticated users)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const courses = await Course.find().populate('program professor');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single course by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('program professor');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new course (Admin or Professor)
// For professors, ensure they can only create courses for themselves.
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, credits, courseCode, semester, program, professor } = req.body;
        if (req.user.role === 'professor' && req.user.id !== professor) {
            return res.status(403).json({ message: 'Professors can only create courses for themselves' });
        }
        const newCourse = new Course({ title, description, credits, courseCode, semester, program, professor });
        await newCourse.save();
        // If a professor is assigned, update their course list.
        if (professor) {
            await User.findByIdAndUpdate(professor, { $push: { courses: newCourse._id } });
        }
        res.json({ message: 'Course created successfully', course: newCourse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a course (Admin or Professor)
// Professors can update only courses they are assigned to.
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (req.user.role === 'professor' && course.professor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: Cannot update a course not assigned to you' });
        }
        const { title, description, credits, courseCode, semester, program, professor } = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { title, description, credits, courseCode, semester, program, professor },
            { new: true }
        );
        res.json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a course (Admin or Professor assigned to the course)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        // Allow deletion if the user is an admin or if they are the assigned professor.
        if (req.user.role === 'professor' && course.professor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You cannot delete a course you are not assigned to' });
        }
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Assign or change professor for a course (Admin only)
router.put('/:id/assign-professor', authorize('admin'), async (req, res) => {
    try {
        const { professorId } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        course.professor = professorId;
        await course.save();
        // Optionally, update the professor's course list.
        await User.findByIdAndUpdate(professorId, { $addToSet: { courses: course._id } });
        res.json({ message: 'Professor assigned successfully', course });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
