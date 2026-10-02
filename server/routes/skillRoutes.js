const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getSkills,
    getWorkerSkills,
    addWorkerSkill,
    removeWorkerSkill
} = require("../controllers/skillController");

const router = express.Router();

// Get all available skills
router.get("/", getSkills);

// Get skills of logged-in worker
router.get(
    "/worker",
    authMiddleware,
    roleMiddleware("worker"),
    getWorkerSkills
);

// Add skill to logged-in worker
router.post(
    "/worker",
    authMiddleware,
    roleMiddleware("worker"),
    addWorkerSkill
);
// Remove skill from logged-in worker
router.delete(
    "/worker/:skill_id",
    authMiddleware,
    roleMiddleware("worker"),
    removeWorkerSkill
);

module.exports = router;