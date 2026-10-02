const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    createContactRequest,
    getContactRequests,
    updateContactRequestStatus
} = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContactRequest);
router.get("/", authMiddleware, roleMiddleware("admin"), getContactRequests);
router.patch("/:id/status", authMiddleware, roleMiddleware("admin"), updateContactRequestStatus);

module.exports = router;
