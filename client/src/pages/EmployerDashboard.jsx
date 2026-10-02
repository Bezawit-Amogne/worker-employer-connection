
import { Link } from "react-router-dom";

function EmployerDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>Employer Dashboard</h1>
                <p>Welcome, {user?.full_name || "Employer"}. Find the right workers and manage your hiring.</p>
            </section>

            <section className="dashboard-cards">
                <Link to="/employer-profile" className="dashboard-card">
                    <h2>My Profile</h2>
                    <p>View and update your employer profile.</p>
                </Link>

                <Link to="/create-job" className="dashboard-card">
                    <h2>Create Job</h2>
                    <p>Post a new job opportunity for workers.</p>
                </Link>

                <Link to="/my-jobs" className="dashboard-card">
                    <h2>My Jobs</h2>
                    <p>View and manage your posted jobs.</p>
                </Link>

                <Link to="/find-workers" className="dashboard-card">
                    <h2>Find Workers</h2>
                    <p>Search for workers based on their skills and experience.</p>
                </Link>

                <Link to="/employer-applications" className="dashboard-card">
                    <h2>Applications</h2>
                    <p>Review job applications and accept or reject candidates.</p>
                </Link>
            </section>
        </main>
    );
}

export default EmployerDashboard;