const jwt = require("jsonwebtoken");
const User = require("../models/auth.model.js");

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header missing or invalid" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("AUTH ERROR:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please login again" });
        }

        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;