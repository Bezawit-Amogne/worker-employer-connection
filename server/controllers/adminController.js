const db = require("../config/db");

const getAdminSummary = async (req, res) => {
    try {
        const [users] = await db.promise().query("SELECT COUNT(*) AS total_users FROM users");
        const [workers] = await db.promise().query("SELECT COUNT(*) AS total_workers FROM workers");
        const [employers] = await db.promise().query("SELECT COUNT(*) AS total_employers FROM employers");
        const [jobs] = await db.promise().query("SELECT COUNT(*) AS total_jobs FROM jobs");
        const [applications] = await db.promise().query("SELECT COUNT(*) AS total_applications FROM applications");
        const [pendingVerifications] = await db.promise().query(
            "SELECT COUNT(*) AS pending_verifications FROM workers WHERE verification_status = 'pending'"
        );

        return res.status(200).json({
            summary: {
                total_users: users[0].total_users,
                total_workers: workers[0].total_workers,
                total_employers: employers[0].total_employers,
                total_jobs: jobs[0].total_jobs,
                total_applications: applications[0].total_applications,
                pending_verifications: pendingVerifications[0].pending_verifications
            }
        });
    } catch (error) {
        console.error("Get admin summary error:", error.message);
        return res.status(500).json({ message: "Something went wrong while loading the admin summary." });
    }
};

const getAdminUsers = async (req, res) => {
    try {
        const [users] = await db.promise().query(
            "SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
        );
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Get admin users error:", error.message);
        return res.status(500).json({ message: "Something went wrong while loading users." });
    }
};

const getAdminWorkers = async (req, res) => {
    try {
        const [workers] = await db.promise().query(
            `SELECT
                workers.id,
                users.full_name,
                users.email,
                workers.location,
                workers.experience_years,
                workers.verification_status,
                workers.education
            FROM workers
            INNER JOIN users ON workers.user_id = users.id
            ORDER BY workers.id DESC`
        );
        return res.status(200).json({ workers });
    } catch (error) {
        console.error("Get admin workers error:", error.message);
        return res.status(500).json({ message: "Something went wrong while loading workers." });
    }
};

const getAdminEmployers = async (req, res) => {
    try {
        const [employers] = await db.promise().query(
            `SELECT
                employers.id,
                users.full_name,
                users.email,
                employers.company_name,
                employers.business_type,
                employers.location
            FROM employers
            INNER JOIN users ON employers.user_id = users.id
            ORDER BY employers.id DESC`
        );
        return res.status(200).json({ employers });
    } catch (error) {
        console.error("Get admin employers error:", error.message);
        return res.status(500).json({ message: "Something went wrong while loading employers." });
    }
};

const getAdminJobs = async (req, res) => {
    try {
        const [jobs] = await db.promise().query(
            `SELECT
                jobs.id,
                jobs.title,
                jobs.category,
                jobs.location,
                jobs.status,
                employers.company_name
            FROM jobs
            INNER JOIN employers ON jobs.employer_id = employers.id
            ORDER BY jobs.created_at DESC`
        );
        return res.status(200).json({ jobs });
    } catch (error) {
        console.error("Get admin jobs error:", error.message);
        return res.status(500).json({ message: "Something went wrong while loading jobs." });
    }
};

const getAdminApplications = async (req, res) => {
    try {
        const [applications] = await db.promise().query(
            `SELECT
                applications.id,
                applications.status,
                jobs.title,
                users.full_name AS worker_name,
                employers.company_name
            FROM applications
            INNER JOIN jobs ON applications.job_id = jobs.id
            INNER JOIN workers ON applications.worker_id = workers.id
            INNER JOIN users ON workers.user_id = users.id
            INNER JOIN employers ON jobs.employer_id = employers.id
            ORDER BY applications.applied_at DESC`
        );
        return res.status(200).json({ applications });
    } catch (error) {
        console.error("Get admin applications error:", error.message);
        return res.status(500).json({ message: "Something went wrong while loading applications." });
    }
};

const updateWorkerVerification = async (req, res) => {
    try {
        const workerId = req.params.id;
        const { status } = req.body;
        const allowed = ["verified", "rejected", "pending"];

        if (!status || !allowed.includes(status)) {
            return res.status(400).json({ message: "Status must be verified, rejected, or pending." });
        }

        const [result] = await db.promise().query(
            "UPDATE workers SET verification_status = ? WHERE id = ?",
            [status, workerId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Worker not found." });
        }

        return res.status(200).json({ message: `Worker verification updated to ${status}.` });
    } catch (error) {
        console.error("Update worker verification error:", error.message);
        return res.status(500).json({ message: "Something went wrong while updating worker verification." });
    }
};

module.exports = {
    getAdminSummary,
    getAdminUsers,
    getAdminWorkers,
    getAdminEmployers,
    getAdminJobs,
    getAdminApplications,
    updateWorkerVerification
};
