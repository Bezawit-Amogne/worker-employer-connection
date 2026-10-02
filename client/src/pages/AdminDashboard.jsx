import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAdminData = async () => {
        try {
            setLoading(true);
            const [summaryData, workersData, jobsData] = await Promise.all([
                apiRequest("/admin/summary"),
                apiRequest("/admin/workers"),
                apiRequest("/admin/jobs")
            ]);

            setSummary(summaryData.summary);
            setWorkers(workersData.workers || []);
            setJobs(jobsData.jobs || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const handleVerification = async (workerId, nextStatus) => {
        try {
            await apiRequest(`/admin/workers/${workerId}/verify`, {
                method: "PATCH",
                body: JSON.stringify({ status: nextStatus })
            });
            loadAdminData();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <section className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Loading system overview...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Review platform activity and worker verification requests.</p>
            </section>

            {error && <p className="error-message">{error}</p>}

            {summary && (
                <section className="dashboard-cards">
                    <article className="dashboard-card"><h2>Total Users</h2><p>{summary.total_users}</p></article>
                    <article className="dashboard-card"><h2>Total Workers</h2><p>{summary.total_workers}</p></article>
                    <article className="dashboard-card"><h2>Total Employers</h2><p>{summary.total_employers}</p></article>
                    <article className="dashboard-card"><h2>Jobs</h2><p>{summary.total_jobs}</p></article>
                    <article className="dashboard-card"><h2>Applications</h2><p>{summary.total_applications}</p></article>
                    <article className="dashboard-card"><h2>Pending Verification</h2><p>{summary.pending_verifications}</p></article>
                </section>
            )}

            <section className="profile-card" style={{ marginTop: "24px" }}>
                <h2>Worker Verification</h2>
                {workers.length === 0 ? (
                    <p>No workers available.</p>
                ) : (
                    workers.map((worker) => (
                        <div key={worker.id} className="list-item">
                            <div>
                                <strong>{worker.full_name}</strong>
                                <p>{worker.email} • {worker.location}</p>
                                <p>Status: {worker.verification_status}</p>
                            </div>
                            <div className="action-row">
                                <button type="button" className="primary-button" onClick={() => handleVerification(worker.id, "verified")}>Verify</button>
                                <button type="button" className="secondary-button small-button" onClick={() => handleVerification(worker.id, "rejected")}>Reject</button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            <section className="profile-card" style={{ marginTop: "24px" }}>
                <h2>Platform Jobs</h2>
                {jobs.length === 0 ? (
                    <p>No jobs found.</p>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="list-item">
                            <div>
                                <strong>{job.title}</strong>
                                <p>{job.company_name} • {job.category} • {job.location}</p>
                            </div>
                            <span className={`status-badge status-${job.status || "pending"}`}>{job.status || "open"}</span>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}

export default AdminDashboard;
