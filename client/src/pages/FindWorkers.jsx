import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function FindWorkers() {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        skill: "",
        location: "",
        experience: ""
    });

    const fetchWorkers = async (nextFilters = filters) => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (nextFilters.skill) params.append("skill", nextFilters.skill);
            if (nextFilters.location) params.append("location", nextFilters.location);
            if (nextFilters.experience) params.append("experience", nextFilters.experience);

            const endpoint = params.toString() ? `/workers/search?${params.toString()}` : "/workers/search";
            const data = await apiRequest(endpoint);
            setWorkers(data.workers || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const handleChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchWorkers(filters);
    };

    const handleClear = () => {
        const empty = { skill: "", location: "", experience: "" };
        setFilters(empty);
        fetchWorkers(empty);
    };

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>Find Workers</h1>
                <p>Search workers by skill, location, and experience.</p>
            </section>

            <section className="profile-card">
                <h2>Search Workers</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Skill</label>
                        <input
                            type="text"
                            name="skill"
                            value={filters.skill}
                            onChange={handleChange}
                            placeholder="Example: Cleaning"
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            placeholder="Example: Addis Ababa"
                        />
                    </div>

                    <div className="form-group">
                        <label>Minimum Experience (years)</label>
                        <input
                            type="number"
                            name="experience"
                            min="0"
                            value={filters.experience}
                            onChange={handleChange}
                            placeholder="2"
                        />
                    </div>

                    <div className="action-row">
                        <button type="submit" className="form-button">Search</button>
                        <button type="button" className="secondary-button small-button" onClick={handleClear}>Clear</button>
                    </div>
                </form>
            </section>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Loading workers...</p>
            ) : workers.length === 0 ? (
                <section className="empty-state">
                    <h2>No workers found</h2>
                    <p>Try adjusting the filters for skill, location, or experience.</p>
                </section>
            ) : (
                <section className="dashboard-cards">
                    {workers.map((worker) => (
                        <article className="dashboard-card" key={worker.id}>
                            <div className="card-top-row">
                                <h2>{worker.full_name}</h2>
                                <span className={`status-badge ${worker.verification_status === "verified" ? "status-approved" : "status-pending"}`}>
                                    {worker.verification_status || "pending"}
                                </span>
                            </div>

                            <p><strong>Location:</strong> {worker.location}</p>
                            <p><strong>Experience:</strong> {worker.experience_years} years</p>
                            <p><strong>Education:</strong> {worker.education}</p>
                            <p><strong>Skills:</strong> {worker.skills || "No skills listed"}</p>
                            <p><strong>Email:</strong> {worker.email}</p>
                            <p><strong>Phone:</strong> {worker.phone}</p>
                            <p><strong>Bio:</strong> {worker.bio}</p>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default FindWorkers;
