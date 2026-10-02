import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function WorkerSkills() {
    const [skills, setSkills] = useState([]);
    const [mySkills, setMySkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [customSkill, setCustomSkill] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const extraSkills = [
        "Computer Skills",
        "Project Management",
        "Customer Service",
        "Warehouse Operations",
        "Driving",
        "Data Entry",
        "Food Service",
        "Construction Labour",
        "Security Guard",
        "Tailoring",
        "Agriculture",
        "Electrical Work",
        "Plumbing",
        "Cleaning",
        "Sales",
        "Marketing",
        "Graphic Design",
        "Web Development",
        "Mobile App Development",
        "Bookkeeping",
        "Catering"
    ];

    // Get all available skills and the worker's skills
    useEffect(() => {
        const getSkills = async () => {
            try {
                const allSkills = await apiRequest("/skills");
                const workerSkills = await apiRequest("/skills/worker");

                const merged = [...(allSkills.skills || []), ...extraSkills.map((name) => ({
                    id: name,
                    name
                }))];

                const uniqueSkills = merged.filter((skill, index, array) => {
                    const normalizedName = skill.name.toLowerCase();
                    return array.findIndex((item) => item.name.toLowerCase() === normalizedName) === index;
                });

                setSkills(uniqueSkills);
                setMySkills(workerSkills.skills);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        getSkills();
    }, []);

    // Add a skill
    const handleAddSkill = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const typedSkill = customSkill.trim();
        const selectedSkillName = selectedSkill && selectedSkill !== "custom"
            ? skills.find((skill) => String(skill.id) === String(selectedSkill))?.name || ""
            : "";
        const skillToSave = typedSkill || selectedSkillName;

        if (!skillToSave) {
            setError("Please select a skill or type a custom skill.");
            return;
        }

        if (skillToSave.length < 2) {
            setError("Skill name must be at least 2 characters long.");
            return;
        }

        try {
            const payload = { skill_name: skillToSave };

            const data = await apiRequest("/skills/worker", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            setMessage(data.message);

            const updatedSkills = await apiRequest(
                "/skills/worker"
            );

            setMySkills(updatedSkills.skills);
            setSelectedSkill("");
            setCustomSkill("");

        } catch (error) {
            setError(error.message);
        }
    };

    // Remove a skill
    const handleRemoveSkill = async (skillId) => {
        console.log("Remove button clicked");
        console.log("Skill ID:", skillId);

        setMessage("");
        setError("");

        try {
            const data = await apiRequest(
                `/skills/worker/${skillId}`,
                {
                    method: "DELETE"
                }
            );

            console.log("Delete response:", data);

            setMessage(data.message);

            // Get updated worker skills
            const updatedSkills = await apiRequest(
                "/skills/worker"
            );

            setMySkills(updatedSkills.skills);

        } catch (error) {
            console.error("Remove skill error:", error);

            setError(error.message);
        }
    };

    // Show loading message
    if (loading) {
        return <p>Loading skills...</p>;
    }

    return (
        <main className="dashboard-page">

            <section className="dashboard-header">

                <h1>My Skills</h1>

                <p>
                    Add and manage your worker skills.
                </p>

            </section>


            {/* Add Skill */}

            <section className="profile-card">

                <h2>Add a Skill</h2>

                <form onSubmit={handleAddSkill}>

                    <div className="form-group">

                        <label>Select Skill</label>

                        <select
                            value={selectedSkill}
                            onChange={(event) => setSelectedSkill(event.target.value)}
                        >

                            <option value="">
                                Select a skill
                            </option>

                            {skills.map((skill) => (
                                <option
                                    key={skill.id}
                                    value={skill.id}
                                >
                                    {skill.name}
                                </option>
                            ))}

                            <option value="custom">
                                Other (type your own skill)
                            </option>

                        </select>

                    </div>

                    <div className="form-group">
                        <label>Or type your own skill</label>
                        <input
                            type="text"
                            value={customSkill}
                            onChange={(event) => setCustomSkill(event.target.value)}
                            placeholder="Example: Digital Marketing"
                        />
                    </div>

                    <button
                        type="submit"
                        className="form-button"
                    >
                        Add Skill
                    </button>

                </form>

            </section>


            {/* Messages */}

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* Current Skills */}

            <section className="profile-card">

                <h2>My Current Skills</h2>

                {mySkills.length === 0 ? (

                    <p>
                        No skills added yet.
                    </p>

                ) : (

                    <ul>

                        {mySkills.map((skill) => (

                            <li key={skill.id}>

                                <span>
                                    {skill.name}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveSkill(
                                            skill.id
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </li>

                        ))}

                    </ul>

                )}

            </section>

        </main>
    );
}

export default WorkerSkills;