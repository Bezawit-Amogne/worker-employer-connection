const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const register = async (req, res) => {
    try {
        const { full_name, email, phone, password, role } = req.body;

        // Check required fields
        if (!full_name || !email || !phone || !password || !role) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        // Validate Ethiopian phone number
        const phoneRegex = /^(09\d{8}|\+2519\d{8})$/;

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: "Please enter a valid Ethiopian phone number."
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters."
            });
        }

        // Check allowed roles
        if (role !== "worker" && role !== "employer") {
            return res.status(400).json({
                message: "Invalid role."
            });
        }

        // Check if email already exists
        const [existingEmail] = await db.promise().query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        // Check if phone already exists
        const [existingPhone] = await db.promise().query(
            "SELECT id FROM users WHERE phone = ?",
            [phone]
        );

        if (existingPhone.length > 0) {
            return res.status(409).json({
                message: "Phone number is already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const [result] = await db.promise().query(
            `INSERT INTO users
            (full_name, email, phone, password, role)
            VALUES (?, ?, ?, ?, ?)`,
            [full_name, email, phone, hashedPassword, role]
        );

        return res.status(201).json({
            message: "Registration successful.",
            user: {
                id: result.insertId,
                full_name,
                email,
                phone,
                role
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while registering."
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        // Find user by email
        const [users] = await db.promise().query(
            "SELECT id, full_name, email, phone, password, role FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = users[0];

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while logging in."
        });
    }
};


module.exports = {
    register,
    login
};