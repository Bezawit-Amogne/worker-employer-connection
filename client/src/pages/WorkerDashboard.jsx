import { Link } from "react-router-dom";

function WorkerDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>Worker Dashboard</h1>
                <p>Welcome, {user?.full_name || "Worker"}. Manage your profile and job opportunities.</p>
            </section>

            <section className="dashboard-cards">
                <Link to="/worker-profile" className="dashboard-card">
                    <h2>My Profile</h2>
                    <p>View and update your worker profile.</p>
                </Link>

                <Link to="/worker-skills" className="dashboard-card">
                    <h2>My Skills</h2>
                    <p>Add and manage your skills.</p>
                </Link>

                <Link to="/find-jobs" className="dashboard-card">
                    <h2>Find Jobs</h2>
                    <p>Browse available job opportunities.</p>
                </Link>

                <Link to="/my-applications" className="dashboard-card">
                    <h2>My Applications</h2>
                    <p>View jobs you have applied for.</p>
                </Link>
            </section>
        </main>
    );
}

export default WorkerDashboard;