import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function EmployerApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await apiRequest("/applications/employer");
            setApplications(data.applications || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const handleStatusChange = async (applicationId, nextStatus) => {
        try {
            setMessage("");
            const data = await apiRequest(`/applications/${applicationId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: nextStatus })
            });

            setMessage(data.message);
            await loadApplications();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <section className="dashboard-header">
                    <h1>Applications</h1>
                    <p>Loading applications submitted to your jobs...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>Applications</h1>
                <p>Review and manage applicants for jobs posted by your company.</p>
            </section>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {applications.length === 0 ? (
                <section className="empty-state">
                    <h2>No applications yet</h2>
                    <p>No worker has applied to any of your jobs yet.</p>
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

                            <p><strong>Worker:</strong> {application.worker_name}</p>
                            <p><strong>Email:</strong> {application.worker_email}</p>
                            <p><strong>Phone:</strong> {application.worker_phone}</p>
                            <p><strong>Location:</strong> {application.location}</p>
                            <p><strong>Category:</strong> {application.category}</p>
                            <p><strong>Applied:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>

                            {application.cover_letter && (
                                <div className="application-note">
                                    <strong>Cover Letter:</strong>
                                    <p>{application.cover_letter}</p>
                                </div>
                            )}

                            <div className="action-row">
                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() => handleStatusChange(application.id, "accepted")}
                                >
                                    Accept
                                </button>
                                <button
                                    type="button"
                                    className="secondary-button small-button"
                                    onClick={() => handleStatusChange(application.id, "rejected")}
                                >
                                    Reject
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default EmployerApplications;
