import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getMyJobs = async () => {
            try {
                const data = await apiRequest("/jobs/my-jobs");

                setJobs(data.jobs);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        getMyJobs();
    }, []);

    if (loading) {
        return (
            <main className="dashboard-page">
                <p>Loading your jobs...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-page">
                <p className="error-message">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="dashboard-page">

            <section className="dashboard-header">

                <h1>My Jobs</h1>

                <p>
                    View and manage the jobs you have posted.
                </p>

            </section>

            <section className="dashboard-cards">

                {jobs.length === 0 ? (

                    <div className="dashboard-card">

                        <h2>No Jobs Yet</h2>

                        <p>
                            You have not posted any jobs yet.
                        </p>

                        <Link to="/create-job">
                            Create Your First Job
                        </Link>

                    </div>

                ) : (

                    jobs.map((job) => (

                        <div
                            className="dashboard-card"
                            key={job.id}
                        >

                            <h2>{job.title}</h2>

                            <p>
                                <strong>Category:</strong>{" "}
                                {job.category}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {job.location}
                            </p>

                            <p>
                                <strong>Salary:</strong>{" "}
                                {job.salary || "Not specified"}
                            </p>

                            <p>
                                <strong>Employment Type:</strong>{" "}
                                {job.employment_type || "Not specified"}
                            </p>

                            <p>
                                <strong>Experience:</strong>{" "}
                                {job.required_experience} years
                            </p>

                            <p>
                                <strong>Workers Needed:</strong>{" "}
                                {job.number_of_workers}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {job.status}
                            </p>

                            <p>
                                {job.description}
                            </p>

                        </div>

                    ))

                )}

            </section>

        </main>
    );
}

export default MyJobs;