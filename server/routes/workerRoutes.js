const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getWorkerProfile,
    createWorkerProfile,
    updateWorkerProfile,
    getAvailableWorkers
} = require("../controllers/workerController");

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("worker"),
    getWorkerProfile
);

router.get(
    "/search",
    authMiddleware,
    roleMiddleware("employer"),
    getAvailableWorkers
);

router.post(
    "/profile",
    authMiddleware,
    roleMiddleware("worker"),
    createWorkerProfile
);

router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("worker"),
    updateWorkerProfile
);

module.exports = router;