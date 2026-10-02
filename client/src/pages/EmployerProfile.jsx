import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function EmployerProfile() {
    const [employer, setEmployer] = useState(null);
    const [formData, setFormData] = useState({
        company_name: "",
        business_type: "",
        location: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadProfile = async () => {
        try {
            const data = await apiRequest("/employers/profile");
            setEmployer(data.employer);
            setFormData({
                company_name: data.employer.company_name || "",
                business_type: data.employer.business_type || "",
                location: data.employer.location || "",
                description: data.employer.description || ""
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

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
            const method = employer ? "PUT" : "POST";
            const path = "/employers/profile";
            const data = await apiRequest(path, {
                method,
                body: JSON.stringify(formData)
            });

            setMessage(data.message);
            await loadProfile();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <p>Loading employer profile...</p>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>{employer ? "My Profile" : "Create Employer Profile"}</h1>
                <p>Manage your company details and hiring information.</p>
            </section>

            <section className="profile-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Company Name</label>
                        <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Business Type</label>
                        <input type="text" name="business_type" value={formData.business_type} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required />
                    </div>

                    <button type="submit" className="form-button">
                        {employer ? "Update Profile" : "Create Profile"}
                    </button>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </section>

            {employer && (
                <section className="profile-card" style={{ marginTop: "24px" }}>
                    <h2>Company Overview</h2>
                    <p><strong>Company:</strong> {employer.company_name}</p>
                    <p><strong>Business Type:</strong> {employer.business_type}</p>
                    <p><strong>Location:</strong> {employer.location}</p>
                    <p><strong>Description:</strong> {employer.description}</p>
                    <p><strong>Email:</strong> {employer.email}</p>
                    <p><strong>Phone:</strong> {employer.phone}</p>
                </section>
            )}
        </main>
    );
}

export default EmployerProfile;
