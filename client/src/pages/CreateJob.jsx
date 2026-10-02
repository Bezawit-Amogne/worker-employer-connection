import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function CreateJob() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        salary: "",
        employment_type: "",
        required_experience: "",
        number_of_workers: "1"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            const data = await apiRequest("/jobs", {
                method: "POST",

                body: JSON.stringify({
                    ...formData,
                    salary: formData.salary
                        ? Number(formData.salary)
                        : null,
                    required_experience: formData.required_experience
                        ? Number(formData.required_experience)
                        : 0,
                    number_of_workers: Number(
                        formData.number_of_workers
                    )
                })
            });

            setMessage(data.message);

            setFormData({
                title: "",
                description: "",
                category: "",
                location: "",
                salary: "",
                employment_type: "",
                required_experience: "",
                number_of_workers: "1"
            });

            setTimeout(() => navigate("/my-jobs", { replace: true }), 800);

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-card">

                <h1>Create Job</h1>

                <p className="auth-description">
                    Post a job opportunity for workers.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Job Title</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: House Cleaner"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the job"
                            rows="5"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Example: Cleaning"
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Example: Bahir Dar"
                        />
                    </div>

                    <div className="form-group">
                        <label>Salary</label>

                        <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            min="0"
                            placeholder="Example: 5000"
                        />
                    </div>

                    <div className="form-group">
                        <label>Employment Type</label>

                        <select
                            name="employment_type"
                            value={formData.employment_type}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select employment type
                            </option>

                            <option value="Full-time">
                                Full-time
                            </option>

                            <option value="Part-time">
                                Part-time
                            </option>

                            <option value="Temporary">
                                Temporary
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Required Experience (Years)</label>

                        <input
                            type="number"
                            name="required_experience"
                            value={formData.required_experience}
                            onChange={handleChange}
                            min="0"
                            placeholder="Example: 2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Number of Workers</label>

                        <input
                            type="number"
                            name="number_of_workers"
                            value={formData.number_of_workers}
                            onChange={handleChange}
                            min="1"
                        />
                    </div>

                    <button
                        type="submit"
                        className="form-button"
                    >
                        Create Job
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

            </div>

        </main>
    );
}

export default CreateJob;