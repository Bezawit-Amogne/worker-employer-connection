import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function FindJobs() {
     const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);

    const [searchData, setSearchData] = useState({
        title: "",
        category: "",
        location: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getJobs = async (filters = {}) => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (filters.title) {
                params.append("title", filters.title);
            }

            if (filters.category) {
                params.append("category", filters.category);
            }

            if (filters.location) {
                params.append("location", filters.location);
            }

            const query = params.toString();

            const endpoint = query
                ? `/jobs?${query}`
                : "/jobs";

            const data = await apiRequest(endpoint);

            setJobs(data.jobs);

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getJobs();
    }, []);

    const handleChange = (event) => {
        setSearchData({
            ...searchData,
            [event.target.name]: event.target.value
        });
    };

    const handleSearch = (event) => {
        event.preventDefault();

        getJobs(searchData);
    };

    const handleClear = () => {
        const emptySearch = {
            title: "",
            category: "",
            location: ""
        };

        setSearchData(emptySearch);

        getJobs();
    };

    return (
        <main className="dashboard-page">

            <section className="dashboard-header">

                <h1>Find Jobs</h1>

                <p>
                    Search for available job opportunities.
                </p>

            </section>

            <section className="profile-card">

                <h2>Search Jobs</h2>

                <form onSubmit={handleSearch}>

                    <div className="form-group">

                        <label>Job Title</label>

                        <input
                            type="text"
                            name="title"
                            value={searchData.title}
                            onChange={handleChange}
                            placeholder="Example: Cleaner"
                        />

                    </div>

                    <div className="form-group">

                        <label>Category</label>

                        <input
                            type="text"
                            name="category"
                            value={searchData.category}
                            onChange={handleChange}
                            placeholder="Example: Cleaning"
                        />

                    </div>

                    <div className="form-group">

                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            value={searchData.location}
                            onChange={handleChange}
                            placeholder="Example: Bahir Dar"
                        />

                    </div>

                    <button
                        type="submit"
                        className="form-button"
                    >
                        Search Jobs
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                    >
                        Clear
                    </button>

                </form>

            </section>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <section className="dashboard-cards">

                {loading ? (

                    <p>Loading jobs...</p>

                ) : jobs.length === 0 ? (

                    <div className="dashboard-card">

                        <h2>No Jobs Found</h2>

                        <p>
                            There are no jobs matching your search.
                        </p>

                    </div>

                ) : (

                    jobs.map((job) => (

                        <div
                            className="dashboard-card"
                            key={job.id}
                        >

                            <h2>{job.title}</h2>

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
                                {job.description}
                            </p>

                            <button
    type="button"
    onClick={() => navigate(`/job/${job.id}`)}
>
    View Job
</button>

                        </div>

                    ))

                )}

            </section>

        </main>
    );
}

export default FindJobs;