const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getEmployerProfile,
    createEmployerProfile,
    updateEmployerProfile
} = require("../controllers/employerController");

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("employer"),
    getEmployerProfile
);

router.post(
    "/profile",
    authMiddleware,
    roleMiddleware("employer"),
    createEmployerProfile
);

router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("employer"),
    updateEmployerProfile
);

module.exports = router;