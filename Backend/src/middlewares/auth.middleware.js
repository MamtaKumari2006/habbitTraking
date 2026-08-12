const jwt= require ('jsonwebtoken');
const User =require ('../models/auth.model.js');

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("AUTH ERROR:", error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }
}

module.exports = authMiddleware;