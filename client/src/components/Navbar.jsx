import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const visitorLinks = (
        <>
            <Link to="/">Home</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </>
    );

    const workerLinks = (
        <>
            <Link to="/worker-dashboard">Dashboard</Link>
            <Link to="/worker-profile">Profile</Link>
            <Link to="/worker-skills">Skills</Link>
            <Link to="/find-jobs">Find Jobs</Link>
            <Link to="/my-applications">My Applications</Link>
            <Link to="/worker-requests">Requests</Link>
            <button type="button" className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </>
    );

    const employerLinks = (
        <>
            <Link to="/employer-dashboard">Dashboard</Link>
            <Link to="/employer-profile">Profile</Link>
            <Link to="/create-job">Create Job</Link>
            <Link to="/my-jobs">My Jobs</Link>
            <Link to="/find-workers">Find Workers</Link>
            <Link to="/employer-applications">Applications</Link>
            <button type="button" className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </>
    );

    const renderLinks = () => {
        if (!token || !user) {
            return visitorLinks;
        }

        if (user.role === "worker") {
            return workerLinks;
        }

        if (user.role === "employer") {
            return employerLinks;
        }

        if (user.role === "admin") {
            return (
                <>
                    <Link to="/admin-dashboard">Admin</Link>
                    <button type="button" className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            );
        }

        return visitorLinks;
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <span className="brand-mark">A</span>
                <span>Agency</span>
            </Link>

            <div className="navbar-links">{renderLinks()}</div>
        </nav>
    );
}

export default Navbar;