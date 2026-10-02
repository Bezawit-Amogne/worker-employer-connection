const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createJob,
    getMyJobs,
    getAvailableJobs,
    getJobById
} = require("../controllers/jobController");

const router = express.Router();

// Create a job
router.post(
    "/",
    authMiddleware,
    roleMiddleware("employer"),
    createJob
);

// Get jobs created by the logged-in employer
router.get(
    "/my-jobs",
    authMiddleware,
    roleMiddleware("employer"),
    getMyJobs
);

// Get available jobs for workers
router.get(
    "/",
    authMiddleware,
    roleMiddleware("worker"),
    getAvailableJobs
);

// Get one job by ID
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("worker"),
    getJobById
);

module.exports = router;