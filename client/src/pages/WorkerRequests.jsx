import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function WorkerRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await apiRequest("/worker-requests/my-requests");
            setRequests(data.requests || []);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const updateStatus = async (requestId, status) => {
        try {
            const data = await apiRequest(`/worker-requests/${requestId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status })
            });
            setMessage(data.message);
            loadRequests();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <section className="dashboard-header">
                    <h1>Employer Requests</h1>
                    <p>Loading requests from employers...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>My Requests</h1>
                <p>Review contact requests from employers and respond to them.</p>
            </section>

            {error && !error.toLowerCase().includes("worker profile not found") && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {error && error.toLowerCase().includes("worker profile not found") ? (
                <section className="empty-state">
                    <h2>Complete your worker profile first</h2>
                    <p>Create your worker profile before you can receive employer requests.</p>
                    <Link to="/create-worker-profile" className="form-button inline-button">
                        Create Profile
                    </Link>
                </section>
            ) : requests.length === 0 ? (
                <section className="empty-state">
                    <h2>No requests yet</h2>
                    <p>You have not received any employer requests.</p>
                </section>
            ) : (
                <section className="dashboard-cards">
                    {requests.map((request) => (
                        <article className="dashboard-card" key={request.id}>
                            <div className="card-top-row">
                                <h2>{request.company_name}</h2>
                                <span className={`status-badge status-${request.status}`}>{request.status}</span>
                            </div>

                            <p><strong>Employer:</strong> {request.employer_name}</p>
                            <p><strong>Email:</strong> {request.employer_email}</p>
                            <p><strong>Phone:</strong> {request.employer_phone}</p>
                            <p><strong>Message:</strong> {request.message}</p>

                            <div className="action-row">
                                <button type="button" className="primary-button" onClick={() => updateStatus(request.id, "accepted")}>Accept</button>
                                <button type="button" className="secondary-button small-button" onClick={() => updateStatus(request.id, "rejected")}>Reject</button>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default WorkerRequests;
