import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function EditWorkerProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        location: "",
        bio: "",
        experience_years: "",
        education: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const data = await apiRequest("/workers/profile");

                const profile = data.worker || data.profile || {};

                setFormData({
                    location: profile.location || "",
                    bio: profile.bio || "",
                    experience_years: profile.experience_years || "",
                    education: profile.education || ""
                });

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        getProfile();
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
            const data = await apiRequest("/workers/profile", {
                method: "PUT",

                body: JSON.stringify({
                    ...formData,
                    experience_years: Number(formData.experience_years)
                })
            });

            setMessage(data.message);
            setTimeout(() => navigate("/worker-profile", { replace: true }), 800);

        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <main className="auth-page">

            <div className="auth-card">

                <h1>Edit Worker Profile</h1>

                <p className="auth-description">
                    Update your worker profile information.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter your location"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>

                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell employers about yourself"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>Experience (Years)</label>

                        <input
                            type="number"
                            name="experience_years"
                            value={formData.experience_years}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Education</label>

                        <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            placeholder="Enter your education"
                        />
                    </div>

                    <button
                        type="submit"
                        className="form-button"
                    >
                        Update Profile
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

export default EditWorkerProfile;