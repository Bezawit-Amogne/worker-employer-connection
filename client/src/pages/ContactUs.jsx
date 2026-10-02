import { useState } from "react";
import { apiRequest } from "../services/api";

function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
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
            const data = await apiRequest("/contact-requests", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            setMessage(data.message);
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>Contact Serategna</h1>
                <p>Send a message and our team will get back to you.</p>
            </section>

            <section className="profile-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Subject</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Message</label>
                        <textarea name="message" rows="6" value={formData.message} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="form-button">Send Message</button>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </section>
        </main>
    );
}

export default ContactUs;
