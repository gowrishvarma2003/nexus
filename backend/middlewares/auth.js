const jwt = require('jsonwebtoken');
const JWT_SECRET = '9b1bb103e8e04d8298bb75399c9f431ab6d441bc6ca28880b4275e42cb8a4d2f';

// Middleware to verify JWT token and check that it contains an email.
const authMiddleware = (req, res, next) => {
    console.log(req.headers);
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if the token payload contains an email field
        if (!decoded.email) {
            return res.status(400).json({ message: 'Token missing email field' });
        }
        req.user = decoded;
        console.log("email",req.user['email']);
        next();
    });
};

// Middleware to authorize based on roles.
const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        authMiddleware,
        (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        }
    ];
};

module.exports = { authMiddleware, authorize, JWT_SECRET };
