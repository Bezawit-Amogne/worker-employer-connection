const db = require("../config/db");

// Get all available skills
const getSkills = async (req, res) => {
    try {
        const [skills] = await db.promise().query(
            "SELECT id, name FROM skills ORDER BY name ASC"
        );

        return res.status(200).json({
            skills
        });

    } catch (error) {
        console.error("Get skills error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while getting skills."
        });
    }
};


// Get skills of the logged-in worker
const getWorkerSkills = async (req, res) => {
    try {
        const userId = req.user.id;

        const [skills] = await db.promise().query(
            `SELECT
                skills.id,
                skills.name
            FROM worker_skills
            INNER JOIN workers
                ON worker_skills.worker_id = workers.id
            INNER JOIN skills
                ON worker_skills.skill_id = skills.id
            WHERE workers.user_id = ?
            ORDER BY skills.name ASC`,
            [userId]
        );

        return res.status(200).json({
            skills
        });

    } catch (error) {
        console.error(
            "Get worker skills error:",
            error.message
        );

        return res.status(500).json({
            message: "Something went wrong while getting worker skills."
        });
    }
};


// Add a skill to the logged-in worker
const addWorkerSkill = async (req, res) => {
    try {
        const userId = req.user.id;
        const rawSkillId = req.body.skill_id;
        const rawSkillName = typeof req.body.skill_name === "string"
            ? req.body.skill_name.trim()
            : "";

        if (!rawSkillId && !rawSkillName) {
            return res.status(400).json({
                message: "Skill is required."
            });
        }

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
        let skillId = rawSkillId ? Number(rawSkillId) : null;

        if (!skillId && rawSkillName) {
            const [existingSkill] = await db.promise().query(
                "SELECT id FROM skills WHERE LOWER(name) = LOWER(?)",
                [rawSkillName]
            );

            if (existingSkill.length > 0) {
                skillId = existingSkill[0].id;
            } else {
                const [insertResult] = await db.promise().query(
                    "INSERT INTO skills (name) VALUES (?)",
                    [rawSkillName]
                );

                skillId = insertResult.insertId;
            }
        }

        if (!skillId) {
            return res.status(400).json({
                message: "Skill is required."
            });
        }

        const [skills] = await db.promise().query(
            "SELECT id FROM skills WHERE id = ?",
            [skillId]
        );

        if (skills.length === 0) {
            return res.status(404).json({
                message: "Skill not found."
            });
        }

        const [existing] = await db.promise().query(
            `SELECT worker_id
             FROM worker_skills
             WHERE worker_id = ? AND skill_id = ?`,
            [workerId, skillId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Skill already added to worker profile."
            });
        }

        await db.promise().query(
            `INSERT INTO worker_skills
            (worker_id, skill_id)
            VALUES (?, ?)`,
            [workerId, skillId]
        );

        return res.status(201).json({
            message: "Skill added successfully."
        });

    } catch (error) {
        console.error(
            "Add worker skill error:",
            error.message
        );

        return res.status(500).json({
            message: "Something went wrong while adding the skill."
        });
    }
};


// Remove a skill from the logged-in worker
const removeWorkerSkill = async (req, res) => {
    try {
        const userId = req.user.id;
        const skillId = req.params.skill_id;

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

        // Remove the skill
        const [result] = await db.promise().query(
            `DELETE FROM worker_skills
             WHERE worker_id = ? AND skill_id = ?`,
            [workerId, skillId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Skill is not assigned to this worker."
            });
        }

        return res.status(200).json({
            message: "Skill removed successfully."
        });

    } catch (error) {
        console.error(
            "Remove worker skill error:",
            error.message
        );

        return res.status(500).json({
            message: "Something went wrong while removing the skill."
        });
    }
};


// Export all skill functions
module.exports = {
    getSkills,
    getWorkerSkills,
    addWorkerSkill,
    removeWorkerSkill
};