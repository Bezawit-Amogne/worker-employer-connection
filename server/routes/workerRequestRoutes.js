const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    createWorkerRequest,
    getWorkerRequests,
    updateWorkerRequestStatus
} = require("../controllers/workerRequestController");

const router = express.Router();

router.get(
    "/my-requests",
    authMiddleware,
    roleMiddleware("worker"),
    getWorkerRequests
);

router.post(
    "/:worker_id",
    authMiddleware,
    roleMiddleware("employer"),
    createWorkerRequest
);

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("worker", "employer"),
    updateWorkerRequestStatus
);

module.exports = router;
