const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    applyForJob,
    getMyApplications,
    getEmployerApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const router = express.Router();

// Get applications of the logged-in worker
router.get(
    "/my-applications",
    authMiddleware,
    roleMiddleware("worker"),
    getMyApplications
);

// Get all applications for the logged-in employer's jobs
router.get(
    "/employer",
    authMiddleware,
    roleMiddleware("employer"),
    getEmployerApplications
);

// Update application status for an employer's own jobs
router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("employer"),
    updateApplicationStatus
);

// Apply for a job
router.post(
    "/jobs/:job_id",
    authMiddleware,
    roleMiddleware("worker"),
    applyForJob
);

module.exports = router;