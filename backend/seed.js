// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models (adjust the path as necessary)
const User = require('./models/User');
const Program = require('./models/Program');
const Course = require('./models/Course');

const MONGO_URI = 'mongodb+srv://9hacks:nkpacmfb8m@cluster0.tasptqf.mongodb.net/'; // Update if necessary

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Program.deleteMany({});
        await Course.deleteMany({});

        // Create dummy users
        const adminPassword = await bcrypt.hash('admin123', 10);
        const professorPassword = await bcrypt.hash('professor123', 10);
        const studentPassword = await bcrypt.hash('student123', 10);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
        });

        const professor = await User.create({
            name: 'Professor User',
            email: 'professor@example.com',
            password: professorPassword,
            role: 'professor',
        });

        const student = await User.create({
            name: 'Student User',
            email: 'student@example.com',
            password: studentPassword,
            role: 'student',
        });

        console.log('Dummy users created');

        // Create dummy programs
        const csProgram = await Program.create({
            name: 'Computer Science',
            description: 'Learn about algorithms, data structures, and more.',
        });

        const mathProgram = await Program.create({
            name: 'Mathematics',
            description: 'Study numbers, patterns, and theories.',
        });

        console.log('Dummy programs created');

        // Create dummy courses for Computer Science program
        const csCourse1 = await Course.create({
            title: 'CS101 - Introduction to Computer Science',
            description: 'Fundamentals of computer science.',
            credits: 3,
            courseCode: 'CS101',
            semester: 'Fall',
            program: csProgram._id,
            professor: professor._id,
        });

        const csCourse2 = await Course.create({
            title: 'CS102 - Data Structures',
            description: 'An introduction to data structures.',
            credits: 4,
            courseCode: 'CS102',
            semester: 'Spring',
            program: csProgram._id,
            professor: professor._id,
        });

        // Associate courses with the program
        csProgram.courses.push(csCourse1._id, csCourse2._id);
        await csProgram.save();

        console.log('Dummy courses created and associated with programs');

        console.log('Seed data uploaded successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error uploading seed data:', err);
        process.exit(1);
    });
