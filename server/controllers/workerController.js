const db = require("../config/db");

const getWorkerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [workers] = await db.promise().query(
            `SELECT 
                workers.id,
                workers.user_id,
                users.full_name,
                users.email,
                users.phone,
                workers.location,
                workers.bio,
                workers.experience_years,
                workers.education,
                workers.verification_status
            FROM workers
            INNER JOIN users ON workers.user_id = users.id
            WHERE workers.user_id = ?`,
            [userId]
        );

        if (workers.length === 0) {
            return res.status(404).json({
                message: "Worker profile not found."
            });
        }

        return res.status(200).json({
            worker: workers[0]
        });

    } catch (error) {
        console.error("Get worker profile error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while getting the worker profile."
        });
    }
};

const createWorkerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            location,
            bio,
            experience_years,
            education
        } = req.body;

        if (!location || !bio || experience_years === undefined || !education) {
            return res.status(400).json({
                message: "All worker profile fields are required."
            });
        }

        const [existingProfile] = await db.promise().query(
            "SELECT id FROM workers WHERE user_id = ?",
            [userId]
        );

        if (existingProfile.length > 0) {
            return res.status(409).json({
                message: "Worker profile already exists."
            });
        }

        const [result] = await db.promise().query(
            `INSERT INTO workers
            (user_id, location, bio, experience_years, education)
            VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                location,
                bio,
                experience_years,
                education
            ]
        );

        return res.status(201).json({
            message: "Worker profile created successfully.",
            profile: {
                id: result.insertId,
                user_id: userId,
                location,
                bio,
                experience_years,
                education,
                verification_status: "pending"
            }
        });

    } catch (error) {
        console.error("Create worker profile error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while creating the worker profile."
        });
    }
};

const updateWorkerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            location,
            bio,
            experience_years,
            education
        } = req.body;

        if (!location || !bio || experience_years === undefined || !education) {
            return res.status(400).json({
                message: "All worker profile fields are required."
            });
        }

        const [result] = await db.promise().query(
            `UPDATE workers
            SET location = ?,
                bio = ?,
                experience_years = ?,
                education = ?
            WHERE user_id = ?`,
            [
                location,
                bio,
                experience_years,
                education,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Worker profile not found."
            });
        }

        return res.status(200).json({
            message: "Worker profile updated successfully."
        });

    } catch (error) {
        console.error("Update worker profile error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while updating the worker profile."
        });
    }
};

const getAvailableWorkers = async (req, res) => {
    try {
        const { skill, location, experience } = req.query;

        let query = `
            SELECT
                workers.id,
                users.full_name,
                users.email,
                users.phone,
                workers.location,
                workers.bio,
                workers.experience_years,
                workers.education,
                workers.verification_status,
                GROUP_CONCAT(DISTINCT skills.name ORDER BY skills.name SEPARATOR ', ') AS skills
            FROM workers
            INNER JOIN users ON workers.user_id = users.id
            LEFT JOIN worker_skills ON worker_skills.worker_id = workers.id
            LEFT JOIN skills ON worker_skills.skill_id = skills.id
            WHERE (workers.verification_status IS NULL
                OR workers.verification_status <> 'rejected')
        `;

        const values = [];

        if (skill) {
            query += " AND skills.name LIKE ?";
            values.push(`%${skill}%`);
        }

        if (location) {
            query += " AND workers.location LIKE ?";
            values.push(`%${location}%`);
        }

        if (experience) {
            query += " AND workers.experience_years >= ?";
            values.push(Number(experience));
        }

        query += `
            GROUP BY
                workers.id,
                users.full_name,
                users.email,
                users.phone,
                workers.location,
                workers.bio,
                workers.experience_years,
                workers.education,
                workers.verification_status
            ORDER BY workers.experience_years DESC, users.full_name ASC`;

        const [workers] = await db.promise().query(query, values);

        return res.status(200).json({ workers });
    } catch (error) {
        console.error("Get available workers error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while getting workers."
        });
    }
};

module.exports = {
    getWorkerProfile,
    createWorkerProfile,
    updateWorkerProfile,
    getAvailableWorkers
};