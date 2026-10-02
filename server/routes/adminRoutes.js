const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    getAdminSummary,
    getAdminUsers,
    getAdminWorkers,
    getAdminEmployers,
    getAdminJobs,
    getAdminApplications,
    updateWorkerVerification
} = require("../controllers/adminController");

const router = express.Router();

router.get("/summary", authMiddleware, roleMiddleware("admin"), getAdminSummary);
router.get("/users", authMiddleware, roleMiddleware("admin"), getAdminUsers);
router.get("/workers", authMiddleware, roleMiddleware("admin"), getAdminWorkers);
router.get("/employers", authMiddleware, roleMiddleware("admin"), getAdminEmployers);
router.get("/jobs", authMiddleware, roleMiddleware("admin"), getAdminJobs);
router.get("/applications", authMiddleware, roleMiddleware("admin"), getAdminApplications);
router.patch("/workers/:id/verify", authMiddleware, roleMiddleware("admin"), updateWorkerVerification);

module.exports = router;
