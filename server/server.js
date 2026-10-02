const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const workerRoutes = require("./routes/workerRoutes");
const employerRoutes = require("./routes/employerRoutes");
const skillRoutes = require("./routes/skillRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const jobRoutes = require("./routes/jobRoutes");
const workerRequestRoutes = require("./routes/workerRequestRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const app = express();
const applicationRoutes = require("./routes/applicationRoutes");
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/worker-requests", workerRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact-requests", contactRoutes);
// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Serategna API is running"
    });
});

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You accessed a protected route.",
        user: req.user
    });
});

// Worker-only test route
app.get(
    "/api/worker-test",
    authMiddleware,
    roleMiddleware("worker"),
    (req, res) => {
        res.json({
            message: "You accessed a worker-only route.",
            user: req.user
        });
    }
);

// Employer-only test route
app.get(
    "/api/employer-test",
    authMiddleware,
    roleMiddleware("employer"),
    (req, res) => {
        res.json({
            message: "You accessed an employer-only route.",
            user: req.user
        });
    }
);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});