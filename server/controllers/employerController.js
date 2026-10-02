const db = require("../config/db");

const getEmployerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [employers] = await db.promise().query(
            `SELECT
                employers.id,
                employers.user_id,
                users.full_name,
                users.email,
                users.phone,
                employers.company_name,
                employers.business_type,
                employers.location,
                employers.description
            FROM employers
            INNER JOIN users ON employers.user_id = users.id
            WHERE employers.user_id = ?`,
            [userId]
        );

        if (employers.length === 0) {
            return res.status(404).json({
                message: "Employer profile not found."
            });
        }

        return res.status(200).json({
            employer: employers[0]
        });

    } catch (error) {
        console.error("Get employer profile error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while getting the employer profile."
        });
    }
};

const createEmployerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            company_name,
            business_type,
            location,
            description
        } = req.body;

        if (!company_name || !business_type || !location || !description) {
            return res.status(400).json({
                message: "All employer profile fields are required."
            });
        }

        const [existingProfile] = await db.promise().query(
            "SELECT id FROM employers WHERE user_id = ?",
            [userId]
        );

        if (existingProfile.length > 0) {
            return res.status(409).json({
                message: "Employer profile already exists."
            });
        }

        const [result] = await db.promise().query(
            `INSERT INTO employers
            (user_id, company_name, business_type, location, description)
            VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                company_name,
                business_type,
                location,
                description
            ]
        );

        return res.status(201).json({
            message: "Employer profile created successfully.",
            profile: {
                id: result.insertId,
                user_id: userId,
                company_name,
                business_type,
                location,
                description
            }
        });

    } catch (error) {
        console.error("Create employer profile error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while creating the employer profile."
        });
    }
};

const updateEmployerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            company_name,
            business_type,
            location,
            description
        } = req.body;

        if (!company_name || !business_type || !location || !description) {
            return res.status(400).json({
                message: "All employer profile fields are required."
            });
        }

        const [result] = await db.promise().query(
            `UPDATE employers
            SET company_name = ?,
                business_type = ?,
                location = ?,
                description = ?
            WHERE user_id = ?`,
            [
                company_name,
                business_type,
                location,
                description,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employer profile not found."
            });
        }

        return res.status(200).json({
            message: "Employer profile updated successfully."
        });

    } catch (error) {
        console.error("Update employer profile error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while updating the employer profile."
        });
    }
};

module.exports = {
    getEmployerProfile,
    createEmployerProfile,
    updateEmployerProfile
};