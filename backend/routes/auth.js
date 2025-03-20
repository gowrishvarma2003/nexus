const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middlewares/auth');

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/login', async (req, res) => {
    console.log('login');
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) return res.status(400).json({ message: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        console.log(valid);
        if (!valid) return res.status(400).json({ message: 'Invalid password' });

        // Include email in the token payload
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(token);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
