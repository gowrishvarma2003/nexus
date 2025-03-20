const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { authMiddleware, authorize } = require('../middlewares/auth');

// GET all courses
// If the logged-in user is a professor, filter courses by their email.
router.get('/', authMiddleware, async (req, res) => {
    try {
        // For a professor, filter using their email.
        const filter = req.user.role === 'professor'
            ? { professor: req.user.email }
            : req.query.professorEmail ? { professor: req.query.professorEmail } : {};

        // Find courses (populate only the 'program' field as professor is now stored as a string)
        const courses = await Course.find(filter).populate('program');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single course by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('program');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST - Create a new course (Admin or Professor)
// For professors, ensure they can only create courses for their own email.
router.post('/', authMiddleware, async (req, res) => {
    try {
        var { title, description, credits, courseCode, semester, program, professor } = req.body;
        // If a professor is logged in, ensure the provided professor email matches their own email.
        if (req.user.role === 'professor' && req.user.email !== professor) {
            return res.status(403).json({ message: 'Professors can only create courses for their own account' });
        }
        // Create the new course using the provided professor email (for admin, any valid email is allowed)
        const newCourse = new Course({ title, description, credits, courseCode, semester, program, professor });
        await newCourse.save();
        res.json({ message: 'Course created successfully', course: newCourse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT - Update a course (Admin or Professor)
// Professors can update only courses assigned to their email.
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (req.user.role === 'professor' && course.professor !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden: Cannot update a course not assigned to you' });
        }

        const { title, description, credits, courseCode, semester, program, professor } = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                credits,
                courseCode,
                semester,
                program,
                professor: req.user.role === 'admin' ? professor : req.user.email
            },
            { new: true }
        );
        res.json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE - Delete a course (Admin or Professor assigned to the course)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (req.user.role === 'professor' && course.professor !== req.user.email) {
            return res.status(403).json({ message: 'Forbidden: You cannot delete a course you are not assigned to' });
        }
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT - Assign or change professor for a course (Admin only)
// Here the admin provides a professor's email.
router.put('/:id/assign-professor', authorize('admin'), async (req, res) => {
    try {
        const { professorEmail } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        course.professor = professorEmail;
        await course.save();
        res.json({ message: 'Professor assigned successfully', course });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
