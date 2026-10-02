import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function JobDetails() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getJob = async () => {
            try {
                const data = await apiRequest(`/jobs/${id}`);

                setJob(data.job);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        getJob();
    }, [id]);

    const handleApply = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            const data = await apiRequest(
                `/applications/jobs/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        cover_letter: coverLetter
                    })
                }
            );

            setMessage(data.message);
            setCoverLetter("");

        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <p>Loading job...</p>
            </main>
        );
    }

    if (error && !job) {
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
                <h1>{job.title}</h1>

                <p>
                    View complete information about this job.
                </p>
            </section>

            <section className="profile-card">

                <p>
                    <strong>Company:</strong>{" "}
                    {job.company_name || "Not provided"}
                </p>

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
                    <strong>Required Experience:</strong>{" "}
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

                <h2>Job Description</h2>

                <p>
                    {job.description}
                </p>

            </section>

            <section className="profile-card">

                <h2>Apply for This Job</h2>

                <form onSubmit={handleApply}>

                    <div className="form-group">
                        <label>Cover Letter</label>

                        <textarea
                            value={coverLetter}
                            onChange={(event) =>
                                setCoverLetter(event.target.value)
                            }
                            placeholder="Write a short message to the employer"
                            rows="5"
                        />
                    </div>

                    <button
                        type="submit"
                        className="form-button"
                    >
                        Apply for Job
                    </button>

                </form>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

            </section>

        </main>
    );
}

export default JobDetails;