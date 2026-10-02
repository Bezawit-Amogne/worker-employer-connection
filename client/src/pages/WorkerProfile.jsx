import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function WorkerProfile() {
    const [worker, setWorker] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWorkerProfile = async () => {
            try {
                const data = await apiRequest("/workers/profile");

                setWorker(data.worker);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        getWorkerProfile();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return (
            <main className="dashboard-page">
                <section className="profile-card">
                    <h2>Worker profile not found</h2>
                    <p>Please create your worker profile first before viewing it.</p>
                    <div className="action-row">
                        <Link to="/create-worker-profile" className="primary-button">
                            Create profile
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="dashboard-page">

            <section className="dashboard-header">

                <h1>My Profile</h1>

                <p>
                    View your worker profile information.
                </p>

            </section>

            {worker && (
                <section className="profile-card">

                    <h2>{worker.full_name}</h2>

                    <p>
                        <strong>Email:</strong>{" "}
                        {worker.email}
                    </p>

                    <p>
                        <strong>Phone:</strong>{" "}
                        {worker.phone}
                    </p>

                    <p>
                        <strong>Location:</strong>{" "}
                        {worker.location || "Not provided"}
                    </p>

                    <p>
                        <strong>Experience:</strong>{" "}
                        {worker.experience_years} years
                    </p>

                    <p>
                        <strong>Education:</strong>{" "}
                        {worker.education || "Not provided"}
                    </p>

                    <p>
                        <strong>Bio:</strong>{" "}
                        {worker.bio || "Not provided"}
                    </p>

                    <p>
                        <strong>Verification:</strong>{" "}
                        {worker.verification_status}
                    </p>

                </section>
            )}

        </main>
    );
}

export default WorkerProfile;