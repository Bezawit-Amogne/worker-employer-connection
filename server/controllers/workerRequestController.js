const db = require("../config/db");

const createWorkerRequest = async (req, res) => {
    try {
        const employerUserId = req.user.id;
        const workerId = Number(req.params.worker_id);
        const { message } = req.body;

        if (!workerId) {
            return res.status(400).json({ message: "Worker ID is required." });
        }

        const [employers] = await db.promise().query(
            "SELECT id FROM employers WHERE user_id = ?",
            [employerUserId]
        );

        if (employers.length === 0) {
            return res.status(404).json({ message: "Employer profile not found." });
        }

        const [worker] = await db.promise().query(
            "SELECT id FROM workers WHERE id = ?",
            [workerId]
        );

        if (worker.length === 0) {
            return res.status(404).json({ message: "Worker not found." });
        }

        const [existing] = await db.promise().query(
            "SELECT id FROM worker_requests WHERE employer_id = ? AND worker_id = ?",
            [employers[0].id, workerId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: "A request for this worker already exists." });
        }

        await db.promise().query(
            "INSERT INTO worker_requests (employer_id, worker_id, message, status) VALUES (?, ?, ?, 'pending')",
            [employers[0].id, workerId, message || "I would like to hire this worker."]
        );

        return res.status(201).json({ message: "Request sent successfully." });
    } catch (error) {
        console.error("Create worker request error:", error.message);
        return res.status(500).json({ message: "Something went wrong while sending the request." });
    }
};

const getWorkerRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const [worker] = await db.promise().query(
            "SELECT id FROM workers WHERE user_id = ?",
            [userId]
        );

        if (worker.length === 0) {
            return res.status(404).json({ message: "Worker profile not found." });
        }

        const workerId = worker[0].id;

        const [requests] = await db.promise().query(
            `SELECT
                worker_requests.id,
                worker_requests.message,
                worker_requests.status,
                worker_requests.created_at,
                employers.company_name,
                users.full_name AS employer_name,
                users.email AS employer_email,
                users.phone AS employer_phone
            FROM worker_requests
            INNER JOIN employers ON worker_requests.employer_id = employers.id
            INNER JOIN users ON employers.user_id = users.id
            WHERE worker_requests.worker_id = ?
            ORDER BY worker_requests.created_at DESC`,
            [workerId]
        );

        return res.status(200).json({ requests });
    } catch (error) {
        console.error("Get worker requests error:", error.message);
        return res.status(500).json({ message: "Something went wrong while loading requests." });
    }
};

const updateWorkerRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { status } = req.body;
        const allowed = ["pending", "accepted", "rejected"];

        if (!status || !allowed.includes(status)) {
            return res.status(400).json({ message: "Status must be pending, accepted, or rejected." });
        }

        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === "worker") {
            const [worker] = await db.promise().query(
                "SELECT id FROM workers WHERE user_id = ?",
                [userId]
            );

            if (worker.length === 0) {
                return res.status(404).json({ message: "Worker profile not found." });
            }

            const [result] = await db.promise().query(
                "UPDATE worker_requests SET status = ? WHERE id = ? AND worker_id = ?",
                [status, requestId, worker[0].id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Request not found for your account." });
            }

            return res.status(200).json({ message: `Request status updated to ${status}.` });
        }

        const [employer] = await db.promise().query(
            "SELECT id FROM employers WHERE user_id = ?",
            [userId]
        );

        if (employer.length === 0) {
            return res.status(404).json({ message: "Employer profile not found." });
        }

        const [result] = await db.promise().query(
            "UPDATE worker_requests SET status = ? WHERE id = ? AND employer_id = ?",
            [status, requestId, employer[0].id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Request not found for your company." });
        }

        return res.status(200).json({ message: `Request status updated to ${status}.` });
    } catch (error) {
        console.error("Update worker request error:", error.message);
        return res.status(500).json({ message: "Something went wrong while updating the request." });
    }
};

module.exports = {
    createWorkerRequest,
    getWorkerRequests,
    updateWorkerRequestStatus
};
