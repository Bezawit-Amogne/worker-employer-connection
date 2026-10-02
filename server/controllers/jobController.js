const db = require("../config/db");

// Create a job for the logged-in employer
const createJob = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            title,
            description,
            category,
            location,
            salary,
            employment_type,
            required_experience,
            number_of_workers
        } = req.body;

        // Validate required fields
        if (
            !title ||
            !description ||
            !category ||
            !location
        ) {
            return res.status(400).json({
                message: "Title, description, category, and location are required."
            });
        }

        // Find the logged-in employer
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

        // Create the job
        const [result] = await db.promise().query(
            `INSERT INTO jobs
            (
                employer_id,
                title,
                description,
                category,
                location,
                salary,
                employment_type,
                required_experience,
                number_of_workers
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employerId,
                title,
                description,
                category,
                location,
                salary || null,
                employment_type || null,
                required_experience || 0,
                number_of_workers || 1
            ]
        );

        return res.status(201).json({
            message: "Job created successfully.",
            job_id: result.insertId
        });

    } catch (error) {
        console.error("Create job error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while creating the job."
        });
    }
};


// Get jobs created by the logged-in employer
const getMyJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the logged-in employer
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

        // Get jobs created by this employer
        const [jobs] = await db.promise().query(
            `SELECT
                id,
                title,
                description,
                category,
                location,
                salary,
                employment_type,
                required_experience,
                number_of_workers,
                status,
                created_at,
                updated_at
            FROM jobs
            WHERE employer_id = ?
            ORDER BY created_at DESC`,
            [employerId]
        );

        return res.status(200).json({
            jobs
        });

    } catch (error) {
        console.error("Get my jobs error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while getting your jobs."
        });
    }
};


const getAvailableJobs = async (req, res) => {
    try {
        const { title, category, location } = req.query;

        let query = `
            SELECT
                jobs.id,
                jobs.title,
                jobs.description,
                jobs.category,
                jobs.location,
                jobs.salary,
                jobs.employment_type,
                jobs.required_experience,
                jobs.number_of_workers,
                jobs.status,
                jobs.created_at,
                employers.company_name
            FROM jobs
            INNER JOIN employers
                ON jobs.employer_id = employers.id
            WHERE jobs.status = 'open'
        `;

        const values = [];

        if (title) {
            query += " AND jobs.title LIKE ?";
            values.push(`%${title}%`);
        }

        if (category) {
            query += " AND jobs.category LIKE ?";
            values.push(`%${category}%`);
        }

        if (location) {
            query += " AND jobs.location LIKE ?";
            values.push(`%${location}%`);
        }

        query += " ORDER BY jobs.created_at DESC";

        const [jobs] = await db.promise().query(
            query,
            values
        );

        return res.status(200).json({
            jobs
        });

    } catch (error) {
        console.error(
            "Get available jobs error:",
            error.message
        );

        return res.status(500).json({
            message: "Something went wrong while getting available jobs."
        });
    }
};
// Get one job by ID
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        const [jobs] = await db.promise().query(
            `SELECT
                jobs.id,
                jobs.title,
                jobs.description,
                jobs.category,
                jobs.location,
                jobs.salary,
                jobs.employment_type,
                jobs.required_experience,
                jobs.number_of_workers,
                jobs.status,
                jobs.created_at,
                employers.company_name
            FROM jobs
            INNER JOIN employers
                ON jobs.employer_id = employers.id
            WHERE jobs.id = ?`,
            [jobId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        return res.status(200).json({
            job: jobs[0]
        });

    } catch (error) {
        console.error(
            "Get job by ID error:",
            error.message
        );

        return res.status(500).json({
            message: "Something went wrong while getting the job."
        });
    }
};
module.exports = {
    createJob,
    getMyJobs,
    getAvailableJobs, 
     getJobById
};