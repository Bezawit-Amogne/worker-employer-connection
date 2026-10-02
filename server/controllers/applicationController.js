const db = require("../config/db");

// Apply for a job
const applyForJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobId = req.params.job_id;
        const { cover_letter } = req.body;

        // Find the logged-in worker
        const [workers] = await db.promise().query(
            "SELECT id FROM workers WHERE user_id = ?",
            [userId]
        );

        if (workers.length === 0) {
            return res.status(404).json({
                message: "Worker profile not found."
            });
        }

        const workerId = workers[0].id;

        // Check if the job exists and is open
        const [jobs] = await db.promise().query(
            `SELECT id
             FROM jobs
             WHERE id = ? AND status = 'open'`,
            [jobId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found or job is closed."
            });
        }

        // Check if the worker already applied
        const [existingApplications] = await db.promise().query(
            `SELECT id
             FROM applications
             WHERE job_id = ? AND worker_id = ?`,
            [jobId, workerId]
        );

        if (existingApplications.length > 0) {
            return res.status(409).json({
                message: "You have already applied for this job."
            });
        }

        // Create application
        const [result] = await db.promise().query(
            `INSERT INTO applications
            (job_id, worker_id, cover_letter)
            VALUES (?, ?, ?)`,
            [
                jobId,
                workerId,
                cover_letter || null
            ]
        );

        return res.status(201).json({
            message: "Application submitted successfully.",
            application_id: result.insertId
        });

    } catch (error) {
        console.error(
            "Apply for job error:",
            error.message
        );

        return res.status(500).json({
            message: "Something went wrong while applying for the job."
        });
    }
};


// Get applications of the logged-in worker
const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the logged-in worker
        const [workers] = await db.promise().query(
            "SELECT id FROM workers WHERE user_id = ?",
            [userId]
        );

        if (workers.length === 0) {
            return res.status(404).json({
                message: "Worker profile not found."
            });
        }

        const workerId = workers[0].id;

        // Get the worker's applications with job information
        const [applications] = await db.promise().query(
            `SELECT
                applications.id,
                applications.job_id,
                applications.cover_letter,
                applications.status,
                applications.applied_at,
                jobs.title,
                jobs.category,
                jobs.location,
                jobs.salary,
                jobs.employment_type,
                employers.company_name
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            INNER JOIN employers
                ON jobs.employer_id = employers.id
            WHERE applications.worker_id = ?
            ORDER BY applications.applied_at DESC`,
            [workerId]
        );

        return res.status(200).json({
            applications
        });

    } catch (error) {
        console.error(
            "Get my applications error:",
            error.message
        );

        return res.status(500).json({
            message: "Something went wrong while getting your applications."
        });
    }
};


const getEmployerApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        const [employers] = await db.promise().query(
            "SELECT id FROM employers WHERE user_id = ?",
            [userId]
        );

        if (employers.length === 0) {
            return res.status(404).json({
                message: "Employer profile not found."
            });
        }

        const employerId = employers[0].id;

        const [applications] = await db.promise().query(
            `SELECT
                applications.id,
                applications.job_id,
                applications.cover_letter,
                applications.status,
                applications.applied_at,
                jobs.title,
                jobs.category,
                jobs.location,
                users.full_name AS worker_name,
                users.email AS worker_email,
                users.phone AS worker_phone
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            INNER JOIN workers
                ON applications.worker_id = workers.id
            INNER JOIN users
                ON workers.user_id = users.id
            WHERE jobs.employer_id = ?
            ORDER BY applications.applied_at DESC`,
            [employerId]
        );

        return res.status(200).json({ applications });
    } catch (error) {
        console.error("Get employer applications error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while getting employer applications."
        });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const applicationId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = ["pending", "accepted", "rejected"];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status must be pending, accepted, or rejected."
            });
        }

        const [employers] = await db.promise().query(
            "SELECT id FROM employers WHERE user_id = ?",
            [userId]
        );

        if (employers.length === 0) {
            return res.status(404).json({
                message: "Employer profile not found."
            });
        }

        const employerId = employers[0].id;

        const [result] = await db.promise().query(
            `UPDATE applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            SET applications.status = ?
            WHERE applications.id = ?
            AND jobs.employer_id = ?`,
            [status, applicationId, employerId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Application not found for your jobs."
            });
        }

        return res.status(200).json({
            message: `Application status updated to ${status}.`
        });
    } catch (error) {
        console.error("Update application status error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while updating the application status."
        });
    }
};

// Export application functions
module.exports = {
    applyForJob,
    getMyApplications,
    getEmployerApplications,
    updateApplicationStatus
};