const db = require("../config/db");

const createContactRequest = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: "Name, email, subject, and message are required."
            });
        }

        await db.promise().query(
            "INSERT INTO contact_requests (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [name, email, phone || null, subject, message]
        );

        return res.status(201).json({
            message: "Your contact request has been sent successfully."
        });
    } catch (error) {
        console.error("Create contact request error:", error.message);
        return res.status(500).json({ message: "Something went wrong while submitting the contact request." });
    }
};

const getContactRequests = async (req, res) => {
    try {
        const [requests] = await db.promise().query(
            "SELECT * FROM contact_requests ORDER BY created_at DESC"
        );

        return res.status(200).json({ contactRequests: requests });
    } catch (error) {
        console.error("Get contact requests error:", error.message);
        return res.status(500).json({ message: "Something went wrong while loading contact requests." });
    }
};

const updateContactRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { status } = req.body;
        const allowed = ["new", "read", "resolved"];

        if (!status || !allowed.includes(status)) {
            return res.status(400).json({ message: "Status must be new, read, or resolved." });
        }

        const [result] = await db.promise().query(
            "UPDATE contact_requests SET status = ? WHERE id = ?",
            [status, requestId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Contact request not found." });
        }

        return res.status(200).json({ message: `Contact request marked as ${status}.` });
    } catch (error) {
        console.error("Update contact request status error:", error.message);
        return res.status(500).json({ message: "Something went wrong while updating the request status." });
    }
};

module.exports = {
    createContactRequest,
    getContactRequests,
    updateContactRequestStatus
};
