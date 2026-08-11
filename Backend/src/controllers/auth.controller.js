const userModel = require("../models/auth.model");
const jwt = require("jsonwebtoken");


async function signUp(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        } else {

            const newUser = new userModel({ username, email, password });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(201).json({
                message: "User created successfully",
                token,
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Check if email & password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Add .select("+password") because we set select: false in schema
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 4. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        res.json({
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }


        });
    } catch (error) {
        console.log(error); // Log error upar likho
        res.status(500).json({ message: "Internal server error" });
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { signUp, login, logout };