import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getMyApplications = async () => {
            try {
                const data = await apiRequest("/applications/my-applications");
                setApplications(data.applications || []);
                setError("");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMyApplications();
    }, []);

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-header">
                    <h1>My Applications</h1>
                    <p>Loading your application history...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>My Applications</h1>
                <p>Track the jobs you have applied for and their current status.</p>
            </section>

            {error && !error.toLowerCase().includes("worker profile not found") && <p className="error-message">{error}</p>}

            {error && error.toLowerCase().includes("worker profile not found") ? (
                <section className="empty-state">
                    <h2>Complete your worker profile first</h2>
                    <p>You need to create your worker profile before you can view or submit applications.</p>
                    <Link to="/create-worker-profile" className="form-button inline-button">
                        Create Profile
                    </Link>
                </section>
            ) : !error && applications.length === 0 ? (
                <section className="empty-state">
                    <h2>No applications yet</h2>
                    <p>You have not applied for any job opportunities yet.</p>
                    <Link to="/find-jobs" className="form-button inline-button">
                        Find Jobs
                    </Link>
                </section>
            ) : (
                <section className="dashboard-cards">
                    {applications.map((application) => (
                        <article className="dashboard-card" key={application.id}>
                            <div className="card-top-row">
                                <h2>{application.title}</h2>
                                <span className={`status-badge status-${application.status}`}>
                                    {application.status}
                                </span>
                            </div>

                            <p>
                                <strong>Company:</strong> {application.company_name || "Not provided"}
                            </p>
                            <p>
                                <strong>Category:</strong> {application.category}
                            </p>
                            <p>
                                <strong>Location:</strong> {application.location}
                            </p>
                            <p>
                                <strong>Salary:</strong> {application.salary || "Not specified"}
                            </p>
                            <p>
                                <strong>Applied:</strong>{" "}
                                {new Date(application.applied_at).toLocaleDateString()}
                            </p>

                            {application.cover_letter && (
                                <div className="application-note">
                                    <strong>Cover Letter:</strong>
                                    <p>{application.cover_letter}</p>
                                </div>
                            )}

                            <Link to={`/job/${application.job_id}`} className="secondary-link">
                                View Job Details
                            </Link>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default MyApplications;
